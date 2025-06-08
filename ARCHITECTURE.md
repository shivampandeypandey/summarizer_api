
# Architecture Document - LLM Summarizer Backend

## Overview

This is a lightweight backend service built with **Node.js + Express**.

It provides an API to:
- Accept customer messages
- Call a Large Language Model (LLM) API
- Return a structured summary

The service is designed to be:
- Simple
- Modular
- Easy to deploy in any cloud or container

---

## Architecture Diagram (Text-based)

```
Client
  |
  v
[  Direct Call ]
  |
  v
[ Express.js App (src/app.js) ]
  |
  v
┌────────────────────────┐
│ Middleware             │
│  - Auth                │
│  - RateLimiter         │
└────────────────────────┘
  |
  v
┌────────────────────────┐
│ Routes                 │
│  - /health             │
│  - /auth               │
│  - /summarize          │
└────────────────────────┘
  |
  v
┌────────────────────────┐
│ Services               │
│  - LLM Service         │
│  - Token Service       │
└────────────────────────┘
  |
  v
[ External LLM API ] (OpenAI )

```

---

## Key Components

### 1. app.js

Main entry point. Sets up:
- Express app
- Middleware
- Routes

### 2. Middleware

- **auth.js** — Validates token in Authorization header
- **rateLimiter.js** — Prevents abuse by limiting number of requests per IP

### 3. Routes

- **/health** — Simple health check endpoint
- **/auth** — auth route
- **/summarize** — Main summarization endpoint

### 4. Services

- **llmService.js** — Makes POST request to the configured LLM API with user message and processes response
- **tokenService.js** — Contains logic to validate tokens.

### 5. Utils

- **logger.js** — Simple logging abstraction (can be replaced with Winston/Stackdriver/Datadog in prod)

---

## Flow of Summarize API

1. Client sends POST `/summarize` with `message` and `Authorization` token
2. Middleware checks token validity and applies rate limiting
3. LLM Service sends message to LLM API (URL + KEY from `.env`)
4. LLM response is parsed and structured
5. JSON response is returned to client


---


## Summary

Simple & modular architecture suitable for:
- Prototypes
- Chatbot intelligence modules
- Contact center AI features
- NLU/NLP pipelines

---

Author: Shivam Pandey
