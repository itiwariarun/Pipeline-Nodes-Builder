# Pipeline Flow Editor

This project is a React-based flow editor for building and visualizing pipelines, with a FastAPI backend for storing and retrieving pipeline data.

## Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- npm (comes with Node.js)
- pip (comes with Python)

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd frontend-20250815T125203Z-1-001
```

### 2. Install Frontend Dependencies

```sh
cd frontend
npm install
```

### 3. Install Backend Dependencies

```sh
cd ../backend
pip install fastapi uvicorn pydantic
```

### 4. Start the Backend Server

```sh
uvicorn main:app --reload
```

The backend will run at [http://localhost:8000](http://localhost:8000).

### 5. Start the Frontend Development Server

```sh
cd ../frontend
npm start
```

The frontend will run at [http://localhost:3000](http://localhost:3000).

## Usage

- Drag and drop node types from the toolbar to build your pipeline.
- Connect nodes visually.
- Click "Submit" to save the pipeline to the backend.
- The backend stores nodes and edges in `db.json` and provides endpoints to fetch or view the pipeline.

## Demo

You can watch a demo of the Pipeline Flow Editor below:

```html
<div style="padding:56.25% 0 0 0;position:relative;">
  <iframe
    src="https://player.vimeo.com/video/1110545447?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;loop=1&amp;dnt=1"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
    title="demo for node builder"
  ></iframe>
</div>
<script src="https://player.vimeo.com/api/player.js"></script>
```

Or, if using Markdown image syntax (for GitHub rendering):

```markdown
![Demo Video](https://vimeo.com/1110545447?share=copy)
```

## API Endpoints

- `GET /pipelines/all` — Fetch all saved nodes and edges.
- `POST /pipelines/parse` — Save nodes and edges to the backend.
- `GET /` — View the pipeline data in a simple HTML table.

## Troubleshooting

- Make sure both frontend (`npm start`) and backend (`uvicorn main:app --reload`) are running.
- If you change backend code, restart the backend server.
- For CORS issues, ensure both servers are running on localhost.

## Learn More

- [React documentation](https://reactjs.org/)
- [FastAPI documentation](https://fastapi.tiangolo.com/)
