
# LLM Summarizer Backend Service

This project is a small **Node.js backend service** that connects to an LLM (Large Language Model) API (openai/gpt-3.5-turbo) to summarize customer complaints or messages.

It provides an API endpoint to:
- Summarize free-form customer messages
- Extract structured details like category, urgency, and sentiment

## Project Structure

```
.env                     # Environment variables (API keys, secrets)
package.json             # Node.js project config & dependencies
src/
├── app.js               # Main application entry point
├── middleware/
│   ├── auth.js          # Authentication middleware
│   ├── rateLimiter.js   # Rate limiting middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── health.js        # Health check endpoint
│   ├── summarize.js     # Summarization API endpoint
├── services/
│   ├── llmService.js    # Service to call the LLM API
│   ├── tokenService.js  # Service for token verification
├── utils/
    ├── logger.js        # Logging utility
```

## How It Works

1. The `POST /summarize` API endpoint accepts a **customer message**.
2. The backend uses an LLM API (configured in `.env`) to summarize and extract insights.
3. The response is returned in a structured format.

## How to Run

### Prerequisites

- Node.js >= 16.x
- An API key for an LLM provider (OpenRouter)

### Installation

```bash
# Clone the repo or extract the provided ZIP
cd summarizer_api


# Install dependencies
npm install
```

### Configuration


```

### Running the server

```bash
npm start
```

The server will start on the port specified in `.env`.

### Available Endpoints

- `GET /health` — Health check
- `POST /auth/login` — (Mock) Authentication endpoint
- `POST /summarize` — Summarize a free-form message (requires token)

### Example `POST /summarize` payload

```json
{
    "message": "I am very frustrated because my order was delayed by 3 weeks and no one is responding."
}
```

Response:

```json
{
    "summary": "...",
    "category": "Order Issue",
    "urgency": "High",
    "sentiment": "Negative"
}
```

## Development Notes

- Basic **auth middleware** to secure `/summarize`
- **Rate limiter** to avoid abuse
- Modular architecture — easy to add more endpoints/services
- Designed for **easy integration with any LLM API**

## License

Shuivam Pandey
