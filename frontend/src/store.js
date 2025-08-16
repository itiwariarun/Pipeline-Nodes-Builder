import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";

// Zustand store for managing nodes, edges, and node IDs in React Flow
export const useStore = create((set, get) => ({
  nodes: [], // Array of node objects
  edges: [], // Array of edge objects
  nodeIDs: {}, // Object to track unique IDs for each node type

  // Generate a unique node ID for a given type
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  // Add a new node to the nodes array
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  // Update nodes array based on changes (drag, position, etc.)
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  // Update edges array based on changes (add, remove, etc.)
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  // Handle connecting two nodes by adding a new edge
  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
        },
        get().edges
      ),
    });
  },

  // Update a specific field in a node's data object
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue },
          };
        }
        return node;
      }),
    });
  },

  // -----------------------------
  // New: Set nodes and edges from backend
  // -----------------------------
  setPipeline: (nodes, edges) => {
    set({
      nodes: nodes || [],
      edges: edges || [],
    });
  },

  // Reset node ID counters based on existing nodes
  resetNodeIDs: (nodeList) => {
    const newIDs = {};
    nodeList.forEach((node) => {
      const [type, numStr] = node.id.split("-");
      const num = parseInt(numStr || "0");
      if (!newIDs[type] || newIDs[type] < num) {
        newIDs[type] = num;
      }
    });
    set({ nodeIDs: newIDs });
  },

  // Optional helper: fetch pipeline from backend and initialize store
  loadPipelineFromBackend: async () => {
    try {
      const res = await fetch("http://localhost:8000/pipelines/all");
      const data = await res.json();
      get().setPipeline(data.nodes, data.edges);
      get().resetNodeIDs(data.nodes);
    } catch (err) {
      console.error("Failed to load pipeline from backend:", err);
    }
  },
}));
