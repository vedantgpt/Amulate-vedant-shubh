'use client';

import { createContext, useContext, ReactNode } from 'react';
import {
    useMaterials,
    useStockLevels,
    useDispatchParameters,
    useMaterialOrders,
    useSalesOrders,
    useSuppliers,
    useEvents
} from './useFirestore';
import {
    materials as staticMaterials,
    stockLevels as staticStockLevels,
    dispatchParameters as staticDispatchParameters,
    materialOrders as staticMaterialOrders,
    salesOrders as staticSalesOrders,
    suppliers as staticSuppliers
} from './data';

// Check if we should use Firebase or static data
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';

interface DataContextType {
    materials: any[];
    stockLevels: any[];
    dispatchParameters: any[];
    materialOrders: any[];
    salesOrders: any[];
    suppliers: any[];
    events: any[];
    loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
    // Use Firebase hooks if enabled, otherwise static data
    const materialsQuery = useMaterials();
    const stockLevelsQuery = useStockLevels();
    const dispatchQuery = useDispatchParameters();
    const ordersQuery = useMaterialOrders();
    const salesQuery = useSalesOrders();
    const suppliersQuery = useSuppliers();
    const eventsQuery = useEvents();

    const loading = USE_FIREBASE && (
        materialsQuery.loading ||
        stockLevelsQuery.loading ||
        dispatchQuery.loading ||
        ordersQuery.loading ||
        salesQuery.loading ||
        suppliersQuery.loading ||
        eventsQuery.loading
    );

    const value: DataContextType = {
        materials: USE_FIREBASE ? materialsQuery.data : staticMaterials,
        stockLevels: USE_FIREBASE ? stockLevelsQuery.data : staticStockLevels,
        dispatchParameters: USE_FIREBASE ? dispatchQuery.data : staticDispatchParameters,
        materialOrders: USE_FIREBASE ? ordersQuery.data : staticMaterialOrders,
        salesOrders: USE_FIREBASE ? salesQuery.data : staticSalesOrders,
        suppliers: USE_FIREBASE ? suppliersQuery.data : staticSuppliers,
        events: USE_FIREBASE ? eventsQuery.data : [],
        loading,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

// Helper function to get stock status
export function getStockStatus(
    partId: string,
    stockLevels: any[],
    dispatchParameters: any[]
): 'healthy' | 'low' | 'critical' {
    const stock = stockLevels.find((s: any) => s.part_id === partId);
    const dispatch = dispatchParameters.find((d: any) => d.part_id === partId);

    if (!stock || !dispatch) return 'healthy';

    if (stock.quantity_available <= dispatch.min_stock_level * 0.5) return 'critical';
    if (stock.quantity_available <= dispatch.min_stock_level) return 'low';
    return 'healthy';
}
