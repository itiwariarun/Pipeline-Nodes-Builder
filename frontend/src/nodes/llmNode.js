import { useCallback, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
/**
 * LLMNode
 * Node for editing and displaying LLM prompt text.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains text)
 */
export const LLMNode = ({ id, data }) => {
  // React Flow hooks for manipulating nodes and edges
  const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  /**
   * Deletes the current node and its connected edges.
   */
  const handleDelete = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    setNodes(nodes.filter((node) => node.id !== id));
    setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id));
  }, [id, getNodes, getEdges, setNodes, setEdges]);
  /**
   * Updates the node's text data when edited.
   */
  const handleTextChange = useCallback(
    (e) => {
      const newText = e.target.value;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, text: newText } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className="p-1 text-gray-100 border rounded-lg shadow-md resize min-w-96 bg-cyan-950 border-slate-800">
      {/* Node Header: Label and Delete Button */}
      <div className="flex items-center justify-between p-2 text-gray-100">
        <p className="font-light text-xl tracking-wide text-cyan-100 px-2.5 py-1.5 bg-cyan-950">
          LLM
        </p>
        <button
          onClick={handleDelete}
          className="w-6 h-6 text-sm font-bold duration-200 bg-transparent rounded-full hover:bg-cyan-900 text-cyan-100"
        >
          ✕
        </button>
      </div>

      {/* Editable text area on focus */}
      <div className="flex flex-col w-full gap-2 px-4 py-6 bg-gray-950">
        <span className="text-sm">LLM:</span>
        {isEditing ? (
          <textarea
            className="w-full px-4 py-2 bg-white rounded-md text-gray-950"
            value={data.text || "This is a LLM."}
            autoFocus
            onChange={handleTextChange}
            onBlur={() => setIsEditing(false)} // back to text when blur
          />
        ) : (
          <p
            className="px-4 py-2 bg-white rounded-md text-gray-950 cursor-text"
            onClick={() => setIsEditing(true)} // switch to textarea
          >
            {data.text || "This is a LLM."}
          </p>
        )}
      </div>

      {/* Handles for connecting nodes */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-system`}
        style={{ top: `${100 / 3}%` }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-prompt`}
        style={{ top: `${200 / 3}%` }}
      />
      <Handle type="source" position={Position.Right} id={`${id}-response`} />
    </div>
  );
};
