import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict

# ----------------------------
# Setup FastAPI app and CORS
# ----------------------------
app = FastAPI()

# Enable CORS for all origins (update for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to ["http://localhost:3000"] in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File for storing pipeline data
DB_FILE = "db.json"

# If file does not exist, create an empty DB
if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w") as f:
        json.dump({"nodes": [], "edges": []}, f)

# ----------------------------
# Models for pipeline, node, and edge
# ----------------------------
class Node(BaseModel):
    id: str
    type: str
    data: Dict
    position: Dict


class Edge(BaseModel):
    id: str
    source: str
    target: str
    type: str


class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


# ----------------------------
# Helper functions for DB read/write
# ----------------------------
def read_db():
    """Read pipeline data from DB file."""
    if not os.path.exists(DB_FILE):
        return {"nodes": [], "edges": []}
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        # corrupted or unreadable file → reset db
        return {"nodes": [], "edges": []}


def write_db(data):
    """Write pipeline data to DB file."""
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)


# ----------------------------
# Routes
# ----------------------------
@app.get("/", response_class=HTMLResponse)
def root():
    """Render HTML page showing pipeline nodes and edges."""
    db = read_db()

    # Safely check if db is empty or invalid
    if not db or not db.get("nodes") and not db.get("edges"):
        return HTMLResponse("<h2>Backend running 🚀</h2><p>No pipeline data found yet.</p>")

    # Otherwise, render data
    nodes_html = "".join(
        [f"<tr><td>{n['id']}</td><td>{n['type']}</td><td>{n['data']}</td><td>{n['position']}</td></tr>" for n in db["nodes"]]
    )
    edges_html = "".join(
        [f"<tr><td>{e['id']}</td><td>{e['source']}</td><td>{e['target']}</td><td>{e['type']}</td></tr>" for e in db["edges"]]
    )

    html = f"""
    <html>
        <head>
            <title>Pipeline Viewer</title>
            <meta http-equiv="refresh" content="5">
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                table {{ border-collapse: collapse; width: 100%; margin-bottom: 30px;over-flow: auto;max-width: 100vw; }}
                th, td {{ border: 1px solid #ccc; padding: 8px; text-align: left;flex-wrap: wrap;max-width:100vh; width:100px; height:40px; overflow-y:hidden; overflow-x:auto; }}
                th {{ background-color: #f2f2f2; }}
                h2 {{ margin-top: 40px; }}
            </style>
        </head>
        <body>
            <h1>🚀 Pipeline Viewer</h1>
            <h2>Nodes</h2>
            <table>
                <tr><th>ID</th><th>Type</th><th>Data</th><th>Position</th></tr>
                {nodes_html or "<tr><td colspan='4'>No nodes available</td></tr>"}
            </table>
            <h2>Edges</h2>
            <table>
                <tr><th>ID</th><th>Source</th><th>Target</th><th>Type</th></tr>
                {edges_html or "<tr><td colspan='4'>No edges available</td></tr>"}
            </table>
        </body>
    </html>
    """
    return HTMLResponse(content=html)


@app.get("/health")
def health_check():
    """Simple JSON health check endpoint."""
    return {"message": "Backend running 🚀"}


@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: Pipeline):
    """
    Save pipeline nodes and edges to DB.
    Returns summary and DAG status (placeholder).
    """
    db = {"nodes": [node.dict() for node in pipeline.nodes],
          "edges": [edge.dict() for edge in pipeline.edges]}
    write_db(db)

    return {
        "message": "Pipeline saved successfully ✅",
        "num_nodes": len(db["nodes"]),
        "num_edges": len(db["edges"]),
        "is_dag": True  # placeholder for DAG check
    }


@app.get("/pipelines/all")
async def get_pipeline():
    """Return all pipeline data from DB."""
    return read_db()
