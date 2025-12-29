// Hugo Database Actions API - Perform CRUD operations via chat

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

// Supported collections
const COLLECTIONS = ['materials', 'stock_levels', 'dispatch_parameters', 'material_orders', 'sales_orders', 'suppliers'];

export async function POST(request: NextRequest) {
    try {
        const { action, collection: collectionName, data, documentId, searchField, searchValue } = await request.json();

        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }

        if (!COLLECTIONS.includes(collectionName)) {
            return NextResponse.json({ error: `Invalid collection. Allowed: ${COLLECTIONS.join(', ')}` }, { status: 400 });
        }

        const collectionRef = collection(db, collectionName);

        switch (action) {
            case 'add': {
                if (!data) {
                    return NextResponse.json({ error: 'Data is required for add action' }, { status: 400 });
                }

                // Extract stock/dispatch info if present (from Hugo AI)
                const { _stock, _min_stock, _location, ...materialData } = data;

                // Add the main document
                const docRef = await addDoc(collectionRef, {
                    ...materialData,
                    created_at: new Date().toISOString(),
                });

                // If adding a material with stock info, also create stock_levels and dispatch_parameters
                if (collectionName === 'materials' && data.part_id) {
                    // Create stock_levels entry
                    await addDoc(collection(db, 'stock_levels'), {
                        part_id: data.part_id,
                        part_name: data.part_name || `Part ${data.part_id}`,
                        location: _location || 'WH1',
                        quantity_available: _stock || 100,
                        created_at: new Date().toISOString(),
                    });

                    // Create dispatch_parameters entry
                    await addDoc(collection(db, 'dispatch_parameters'), {
                        part_id: data.part_id,
                        min_stock_level: _min_stock || 50,
                        reorder_quantity: Math.ceil((_min_stock || 50) * 2),
                        reorder_interval_days: 14,
                        created_at: new Date().toISOString(),
                    });
                }

                return NextResponse.json({
                    success: true,
                    message: `Successfully created ${data.part_id || 'new'} ${collectionName.slice(0, -1)} with stock and dispatch settings`,
                    documentId: docRef.id,
                    action: 'add',
                });
            }

            case 'update': {
                if (!documentId && !searchField) {
                    return NextResponse.json({ error: 'Document ID or search field required for update' }, { status: 400 });
                }
                if (!data) {
                    return NextResponse.json({ error: 'Data is required for update action' }, { status: 400 });
                }

                let targetDocId = documentId;

                // If no direct ID, search by field
                if (!targetDocId && searchField && searchValue) {
                    const q = query(collectionRef, where(searchField, '==', searchValue));
                    const snapshot = await getDocs(q);
                    if (snapshot.empty) {
                        return NextResponse.json({ error: `No document found with ${searchField}=${searchValue}` }, { status: 404 });
                    }
                    targetDocId = snapshot.docs[0].id;
                }

                const docRef = doc(db, collectionName, targetDocId);
                await updateDoc(docRef, {
                    ...data,
                    updated_at: new Date().toISOString(),
                });

                return NextResponse.json({
                    success: true,
                    message: `Successfully updated ${collectionName.slice(0, -1)} (ID: ${targetDocId})`,
                    documentId: targetDocId,
                    action: 'update',
                });
            }

            case 'delete': {
                if (!documentId && !searchField) {
                    return NextResponse.json({ error: 'Document ID or search field required for delete' }, { status: 400 });
                }

                let targetDocId = documentId;

                // If no direct ID, search by field
                if (!targetDocId && searchField && searchValue) {
                    const q = query(collectionRef, where(searchField, '==', searchValue));
                    const snapshot = await getDocs(q);
                    if (snapshot.empty) {
                        return NextResponse.json({ error: `No document found with ${searchField}=${searchValue}` }, { status: 404 });
                    }
                    targetDocId = snapshot.docs[0].id;
                }

                const docRef = doc(db, collectionName, targetDocId);
                await deleteDoc(docRef);

                return NextResponse.json({
                    success: true,
                    message: `Successfully deleted ${collectionName.slice(0, -1)} (ID: ${targetDocId})`,
                    documentId: targetDocId,
                    action: 'delete',
                });
            }

            case 'update_stock': {
                // Special action to update stock quantity
                if (!searchValue) {
                    return NextResponse.json({ error: 'part_id required for stock update' }, { status: 400 });
                }
                const q = query(collectionRef, where('part_id', '==', searchValue));
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    return NextResponse.json({ error: `No stock entry found for part_id=${searchValue}` }, { status: 404 });
                }

                const docRef = doc(db, 'stock_levels', snapshot.docs[0].id);
                await updateDoc(docRef, {
                    ...data,
                    updated_at: new Date().toISOString(),
                });

                return NextResponse.json({
                    success: true,
                    message: `Successfully updated stock for part ${searchValue}`,
                    action: 'update_stock',
                });
            }

            case 'mark_delivered': {
                // Special action to mark order as delivered
                if (!searchValue) {
                    return NextResponse.json({ error: 'order_id required' }, { status: 400 });
                }
                const q = query(collectionRef, where('order_id', '==', searchValue));
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    return NextResponse.json({ error: `No order found with order_id=${searchValue}` }, { status: 404 });
                }

                const docRef = doc(db, collectionName, snapshot.docs[0].id);
                await updateDoc(docRef, {
                    status: 'Delivered',
                    delivered_at: new Date().toISOString(),
                });

                return NextResponse.json({
                    success: true,
                    message: `Successfully marked order ${searchValue} as delivered`,
                    action: 'mark_delivered',
                });
            }

            default:
                return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Hugo Action Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to perform action' },
            { status: 500 }
        );
    }
}
