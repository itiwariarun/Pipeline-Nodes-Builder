import { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";

import "reactflow/dist/style.css";
import {
  BooleanNode,
  ColorNode,
  FileNode,
  MessageNode,
  NumberNode,
} from "./nodes/DemoNode";

// Grid size for snapping nodes
const gridSize = 20;
// React Flow pro options
const proOptions = { hideAttribution: true };

// Mapping node types to their components
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  number: NumberNode,
  color: ColorNode,
  boolean: BooleanNode,
  message: MessageNode,
  file: FileNode,
};

// Selector for zustand store
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  loadPipelineFromBackend: state.loadPipelineFromBackend, // Added for loading from backend
});

// Default edge options for React Flow
const defaultEdgeOptions = {
  type: "turbo",
  markerEnd: "edge-circle",
};

// PipelineUI component renders the main flow editor
export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null); // Ref for flow wrapper div
  const [reactFlowInstance, setReactFlowInstance] = useState(null); // React Flow instance

  // Get state and actions from store
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    loadPipelineFromBackend, // Added for loading from backend
  } = useStore(selector, shallow);

  // Load nodes and edges from backend on mount
  useEffect(() => {
    loadPipelineFromBackend();
  }, [loadPipelineFromBackend]);

  // Helper to initialize node data
  const getInitNodeData = (nodeID, type) => ({
    id: nodeID,
    nodeType: type,
  });

  // Handle dropping a node onto the flow editor
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const appData = JSON.parse(data);
      const type = appData?.nodeType;
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  // Handle drag over event for dropping nodes
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Refs for tracking drag/connect state
  const draggedNodeType = useRef(null);
  const sourceNodeRef = useRef(null);
  const sourceHandleRef = useRef(null);

  // Handle drag start for nodes
  const onDragStart = (event, nodeType) => {
    draggedNodeType.current = nodeType;
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType })
    );
  };

  // Handle start of edge connection
  const onConnectStart = useCallback(
    (event, { nodeId, handleType, handleId }) => {
      sourceNodeRef.current = nodeId;
      sourceHandleRef.current = handleId;
    },
    []
  );

  // Handle end of edge connection (drop target)
  const onConnectEnd = useCallback(
    (event) => {
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const flowPosition = reactFlowInstance.project({ x, y });

      // Find if dropped on an existing node
      const overlappingNode = nodes.find((node) => {
        const { position, width = 450, height = 350 } = node;
        return (
          flowPosition.x >= position.x &&
          flowPosition.x <= position.x + width &&
          flowPosition.y >= position.y &&
          flowPosition.y <= position.y + height
        );
      });

      // If not dropped on a node, create a new node and connect
      if (!overlappingNode && sourceNodeRef.current) {
        const sourceNode = nodes.find((n) => n.id === sourceNodeRef.current);
        const nodeType = sourceNode?.type || "text";
        const nodeID = getNodeID(nodeType);

        addNode({
          id: nodeID,
          type: nodeType,
          position: flowPosition,
          data: getInitNodeData(nodeID, nodeType),
        });

        onConnect({
          source: sourceNodeRef.current,
          target: nodeID,
          sourceHandle: sourceHandleRef.current,
        });

        sourceNodeRef.current = null;
        sourceHandleRef.current = null;
      }
    },
    [reactFlowInstance, nodes, getNodeID, addNode, onConnect]
  );

  return (
    <div
      className="bg-gray-950"
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "40rem" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onDragStart={onDragStart}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        onConnectStart={onConnectStart}
        connectionLineType="smoothstep"
        defaultEdgeOptions={defaultEdgeOptions}
      >
        {/* MiniMap for overview */}
        <MiniMap />
        {/* Background grid */}
        <Background color="#aaa" gap={gridSize} />
        {/* Controls for zoom/pan */}
        <Controls />
        {/* SVG definitions for edge gradients and markers */}
        <svg>
          <defs>
            <linearGradient id="edge-gradient">
              <stop offset="0%" stopColor="#ae53ba" />
              <stop offset="100%" stopColor="#2a8af6" />
            </linearGradient>
            <marker
              id="edge-circle"
              viewBox="-5 -5 10 10"
              refX="0"
              refY="0"
              markerUnits="strokeWidth"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <circle
                stroke="#2a8af6"
                strokeOpacity="0.75"
                r="2"
                cx="0"
                cy="0"
              />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
    </div>
  );
};
