title Victory Locks ERP - AI Powered Manufacturing Platform

// User Layer
User [icon: user, color: blue] {
  MobileAppUser [icon: smartphone, label: "MobileApp"]
  VoiceInput [icon: mic]
  ImageCapture [icon: camera]
}

// Frontend Layer (React Native + Expo)
MobileApp [icon: react, color: cyan] {
  VictoryAI [icon: message-circle, label: "Victory AI Chat", color: purple]
  Inventory [icon: package, label: "Inventory Screen"]
  Batches [icon: layers, label: "Batch Tracking"]
  Reports [icon: bar-chart, label: "Reports Dashboard"]
  StageLog [icon: clipboard, label: "Stage Logging"]
}

// API Layer (Express.js)
API [icon: server, color: green] {
  VictoryAIRoute [icon: brain, label: "/api/victory-ai/chat", color: purple]
  ActionsRoute [icon: database, label: "/api/victory-ai/actions"]
  TranscribeRoute [icon: mic, label: "/api/victory-ai/transcribe"]
  TTSRoute [icon: volume-2, label: "/api/victory-ai/tts"]
  InventoryAPI [icon: package, label: "/api/inventory"]
  BatchAPI [icon: layers, label: "/api/batches"]
}

// AI Processing Layer
AILayer [icon: cpu, color: purple, label: "Victory AI Engine"] {
  GeminiAPI [icon: brain, label: "Google Gemini 1.5"]
  OpenRouter [icon: cloud, label: "OpenRouter (Fallback)"]
  ActionParser [icon: code, label: "Action Block Parser"]
  ContextBuilder [icon: database, label: "Factory Context"]
}

// Speech Services
SpeechLayer [icon: mic, color: orange, label: "Speech Services"] {
  GoogleSTT [icon: mic, label: "Google Speech-to-Text"]
  GoogleTTS [icon: volume-2, label: "Google Text-to-Speech"]
  Transliterate [icon: type, label: "Devanagari → Roman"]
}

// Vision Services
VisionLayer [icon: eye, color: blue, label: "Vision Services"] {
  GoogleVision [icon: camera, label: "Google Cloud Vision"]
  OCR [icon: file-text, label: "OCR Text Extraction"]
}

// Data Layer
Database [icon: database, color: green, label: "MongoDB Atlas"] {
  InventoryCol [icon: box, label: "inventory"]
  BatchCol [icon: layers, label: "batches"]
  StageLogCol [icon: clipboard, label: "stagelogs"]
  PartyCol [icon: users, label: "parties"]
  MachineCol [icon: settings, label: "machines"]
}

// Storage Layer
Storage [icon: hard-drive, color: gray, label: "Cloudflare R2"] {
  Images [icon: image, label: "Product Images"]
  Documents [icon: file, label: "Batch Documents"]
}

// Connections - Main Flow
MobileAppUser > MobileApp
MobileAppUser > VictoryAI: Open Chat
VoiceInput > TranscribeRoute: Record Audio
ImageCapture > GoogleVision: Capture Image

VictoryAI > VictoryAIRoute: POST message
VictoryAIRoute > ContextBuilder: Build factory context
ContextBuilder > GeminiAPI: Send prompt
GeminiAPI > ActionParser: Parse response

// Action Execution Flow
VictoryAI > ActionsRoute: User confirms action
ActionsRoute > Database: Execute CRUD

// Speech Flow
TranscribeRoute > GoogleSTT: Transcribe audio
GoogleSTT > Transliterate: If Devanagari detected

// Real-time Updates
Inventory > InventoryCol: Fetch items
Batches > BatchCol: Fetch batches

// ============================================================

// Stage 1: User Input
UserInput [icon: user, color: blue, label: "User Input"] {
  TextMessage [icon: type, label: "Text Query"]
  VoiceMessage [icon: mic, label: "Voice (Hinglish/Hindi)"]
  ImageMessage [icon: camera, label: "Image + OCR"]
}

// Stage 2: Frontend Processing
ChatUI [icon: smartphone, color: cyan, label: "Victory Chat UI"] {
  ContextCard [icon: bar-chart, label: "System State Card"]
  ChatStream [icon: message-circle, label: "AI + USER Messages"]
  ActionBar [icon: check-square, label: "Confirm/Cancel Bar"]
  InputArea [icon: type, label: "Voice + Text Input"]
}

// Stage 3: Backend Processing
Backend [icon: server, color: green, label: "Express Backend"] {
  ChatRoute [icon: brain, label: "/chat Route"]
  ContextFetcher [icon: database, label: "Fetch Factory Data"]
  PromptBuilder [icon: terminal, label: "Build System Prompt"]
  IntentValidator [icon: shield, label: "Validate Required Fields"]
}

// Stage 4: AI Processing
AIProcess [icon: cpu, color: purple, label: "LLM Processing"] {
  SystemPrompt [icon: file-code, label: "Hugo-style Prompt"]
  ActionBlock [icon: code, label: "Parse action block"]
  IntentStatus [icon: filter, label: "NONE / DRAFT / READY"]
}

// Stage 5: State Machine
StateMachine [icon: git-branch, color: orange, label: "Intent State"] {
  StateNone [icon: circle, label: "NONE: Read-only query"]
  StateDraft [icon: edit, label: "DRAFT: Missing fields"]
  StateReady [icon: check-circle, label: "READY: Action pending"]
}

// Stage 6: Execution
Execution [icon: zap, color: red, label: "Deterministic Executor"] {
  ActionsEndpoint [icon: server, label: "/actions Endpoint"]
  ModuleRegistry [icon: folder, label: "CRUD Modules"]
  DatabaseWrite [icon: database, label: "MongoDB Write"]
  SystemMessage [icon: check, label: "SYSTEM Confirmation"]
}

// Flow Connections
TextMessage > InputArea
VoiceMessage > Backend: Base64 Audio
ImageMessage > Backend: Base64 Image

InputArea > ChatRoute: POST /chat
ContextFetcher > PromptBuilder
PromptBuilder > SystemPrompt

SystemPrompt > ActionBlock
ActionBlock > IntentStatus
IntentStatus > StateMachine


ActionsEndpoint > ModuleRegistry
ModuleRegistry > DatabaseWrite
DatabaseWrite > SystemMessage

// ============================================================

// Inventory Collection
InventoryModel [icon: package, color: green, label: "inventory"] {
  Name_1 [icon: type, label: "name: String"]
  Category [icon: tag, label: "category: raw|semi|finished|scrap"]
  Quantity [icon: hash, label: "quantity: Number"]
  MinStock [icon: alert-triangle, label: "minStockLevel: Number"]
  Unit [icon: ruler, label: "unit: pcs|kg|meters"]
  CostPerUnit [icon: dollar-sign, label: "costPerUnit: Number"]
  ImageUrl [icon: image, label: "imageUrl: String"]
}

// Batch Collection
BatchModel [icon: layers, color: blue, label: "batches"] {
  HandleCode [icon: hash, label: "handleCode: String (unique)"]
  InputQty_1 [icon: log-in, label: "inputQty: Number"]
  CurrentQty [icon: package, label: "currentQty: Number"]
  CurrentStage [icon: git-commit, label: "currentStage: String"]
  Status [icon: activity, label: "status: active|completed|paused"]
  LossTotal [icon: trending-down, label: "lossTotal: Number"]
}

// StageLog Collection
StageLogModel [icon: clipboard, color: orange, label: "stagelogs"] {
  BatchId [icon: link, label: "batchId: ObjectId"]
  Stage [icon: git-commit, label: "stage: String"]
  InputQty_2 [icon: log-in, label: "inputQty: Number"]
  OutputQty [icon: log-out, label: "outputQty: Number"]
  LossQty [icon: x-circle, label: "lossQty: Number"]
  LossReason [icon: alert-circle, label: "lossReason: String"]
  Operator [icon: user, label: "operatorName: String"]
}

// Party Collection
PartyModel [icon: users, color: purple, label: "parties"] {
  Name_2 [icon: type, label: "name: String"]
  Type [icon: tag, label: "type: customer|supplier"]
  Phone [icon: phone, label: "phone: String"]
  GST [icon: file-text, label: "gstNumber: String"]
  Balance [icon: dollar-sign, label: "balance: Number"]
}

// Relationships
HandleCode > BatchId: 1 to Many
InventoryModel > BatchModel: Raw materials used
PartyModel > BatchModel: Customer orders

// ============================================================

// Mobile Frontend
MobileFrontend [icon: smartphone, color: cyan, label: "Mobile App"] {
  ReactNative [icon: react, label: "React Native"]
  Expo [icon: smartphone, label: "Expo SDK 52"]
  ExpoRouter [icon: navigation, label: "Expo Router"]
  ExpoAV [icon: mic, label: "expo-av (Audio)"]
}

// Backend
BackendStack [icon: server, color: green, label: "Backend"] {
  ExpressJS [icon: server, label: "Express.js"]
  NodeJS [icon: hexagon, label: "Node.js 20"]
  Mongoose [icon: database, label: "Mongoose ODM"]
  Multer [icon: upload, label: "Multer (File Upload)"]
}

// AI Services
AIServices [icon: brain, color: purple, label: "AI Services"] {
  Gemini [icon: cpu, label: "Google Gemini 1.5 Flash"]
  OpenRouterAI [icon: cloud, label: "OpenRouter LLM"]
  CloudVision [icon: eye, label: "Google Cloud Vision"]
  CloudSpeech [icon: mic, label: "Google Cloud Speech"]
}

// Data Layer
DataLayer [icon: database, color: orange, label: "Data Layer"] {
  MongoDB [icon: database, label: "MongoDB Atlas"]
  CloudflareR2 [icon: hard-drive, label: "Cloudflare R2"]
}

// Deployment
Deployment [icon: cloud, color: gray, label: "Deployment"] {
  Render [icon: server, label: "Render (Backend)"]
  ExpoGo [icon: smartphone, label: "Expo Go (Dev)"]
  EASBuild [icon: package, label: "EAS Build (Prod)"]
}

// Connections
MobileFrontend > BackendStack: REST API
BackendStack > AIServices: AI Processing
BackendStack > DataLayer: CRUD Operations

// ============================================================

// Query Actions
QueryActions [icon: search, color: blue, label: "Query Actions"] {
  InventoryQuery [icon: package, label: "Get Inventory"]
  BatchQuery [icon: layers, label: "Get Batch Status"]
  WastageQuery [icon: trending-down, label: "Get Wastage %"]
  LowStockQuery [icon: alert-triangle, label: "Low Stock Alert"]
}

// Create Actions
CreateActions [icon: plus-circle, color: green, label: "Create Actions"] {
  AddInventory [icon: package, label: "Add Inventory Item"]
  CreateBatch [icon: layers, label: "Create New Batch"]
  LogStage [icon: clipboard, label: "Log Stage Completion"]
  AddParty [icon: users, label: "Add Customer/Supplier"]
}

// Update Actions
UpdateActions [icon: edit, color: orange, label: "Update Actions"] {
  UpdateStock [icon: trending-up, label: "Update Stock Level"]
  AdvanceStage [icon: skip-forward, label: "Advance Batch Stage"]
  UpdateParty [icon: users, label: "Update Party Info"]
}

// Delete Actions
DeleteActions [icon: trash-2, color: red, label: "Delete Actions"] {
  DeleteItem [icon: x-circle, label: "Delete Inventory"]
  DeleteBatch [icon: x-circle, label: "Delete Batch"]
}

// Action Executor
Executor [icon: cpu, color: purple, label: "Deterministic Executor"] {
  Validate [icon: shield, label: "Validate Fields"]
  Execute [icon: play, label: "Execute Action"]
  Confirm [icon: check, label: "Return SYSTEM Message"]
}

// Connections
QueryActions > Validate
CreateActions > Validate
UpdateActions > Validate
DeleteActions > Validate

Validate > Execute
Execute > Confirm

title Victory AI_1 - 3 State Intent Lifecycle [label: "Victory AI"]
title Victory Locks - MongoDB Collections
title Victory Locks ERP - Technology Stack
title Victory AI_2 - Supported Actions [label: "Victory AI"]
ChatUI > Execution: User confirms
Execution > ChatUI: ✓ Item added
VictoryAI < ActionParser: Return intentStatus
VictoryAI < Database: Return result
VictoryAI < Transliterate: Return Hinglish text
ChatStream < StateNone: No buttons
ChatStream < StateDraft: Ask missing fields
ActionBar < StateReady: Show Confirm/Cancel
MobileFrontend < DataLayer: Real-time Updates