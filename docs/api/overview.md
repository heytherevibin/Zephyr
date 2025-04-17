# Zephyr API Documentation

## Overview

The Zephyr Chat Widget API provides endpoints for managing chat conversations, customers, and API keys. This documentation covers the available endpoints, authentication methods, and usage examples.

## Authentication

All API endpoints require authentication using an API key. Include the API key in the `Authorization` header:

```http
Authorization: Bearer your-api-key
```

## Base URL

```
https://your-domain.com/api
```

## Rate Limiting

The API implements rate limiting based on the API key tier:
- Free: 100 requests/minute
- Pro: 1000 requests/minute
- Enterprise: Custom limits

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human readable error message"
  }
}
``` 