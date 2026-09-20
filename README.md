# 🚀 Meta Lead Ads Real-Time Tracking System

A full-stack, real-time Meta (Facebook/Instagram) Lead Ads tracking application. This system receives webhooks from Meta, enriches and flattens lead payload responses via the Meta Graph API, and instantly pushes incoming leads to a React Native (Expo) mobile application using WebSockets (`Socket.io`).

---

## 🏗️ System Architecture & Data Flow

```text
[ Meta Lead Ad Form ]
        │
        │ 1. POST Webhook (leadgen_id)
        ▼
[ Express Backend ]
        │
        ├─► 2. Meta Graph API (Fetches form field answers)
        ├─► 3. Data Pipeline (Deduplicates ID & flattens field key-values)
        │
        │ 4. WebSocket Emission (io.emit)
        ▼
[ React Native App (Expo) ] ──► 5. Live UI update on FlatList