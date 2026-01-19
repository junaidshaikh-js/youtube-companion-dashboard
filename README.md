This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Run the development server:

```bash
yarn dev
```

## API Endpoints

### Video
- **GET** `/api/v1/video`
  - Fetches details for the current video.
- **PUT** `/api/v1/video`
  - Updates the title and description of the current video.
  - **Body**: `{ "title": "string", "description": "string" }`

### Comments
- **GET** `/api/v1/comments?videoId=<id>`
  - Fetches comments for a specific video.
- **POST** `/api/v1/comments`
  - Adds a new top-level comment to a video.
  - **Body**: `{ "videoId": "string", "text": "string" }`
- **DELETE** `/api/v1/comments?commentId=<id>`
  - Deletes a comment by ID.

### Replies
- **GET** `/api/v1/replies?parentId=<id>`
  - Fetches replies for a specific comment.
- **POST** `/api/v1/replies`
  - Adds a reply to a comment thread.
  - **Body**: `{ "parentId": "string", "text": "string" }`

### Notes
- **GET** `/api/v1/notes?videoId=<id>&query=<text>`
  - Fetches internal notes for a specific video.
  - **Query Params**: `videoId` (required), `query` (optional - filter by text)
- **POST** `/api/v1/notes`
  - Creates a new internal note for a video.
  - **Body**: `{ "videoId": "string", "note": "string" }`

### AI Suggestions
- **POST** `/api/v1/suggestions/title`
  - Generates AI-powered title suggestions using Google Gemini.
  - **Body**: `{ "title": "string", "description": "string" }`

### Health Check
- **GET** `/api/v1/health`
  - Returns the application and database connection status.

## Database Schema (MongoDB)

### Note Model
The application uses MongoDB to store internal metadata and notes for YouTube videos.

| Field | Type | Description |
| :--- | :--- | :--- |
| `videoId` | String | The YouTube Video ID  |
| `note` | String | The content of the note |
| `createdAt` | Date | Timestamp when the note was created |
| `updatedAt` | Date | Timestamp when the note was last updated |
