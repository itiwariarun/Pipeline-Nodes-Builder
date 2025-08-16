import { useState, useMemo, useCallback } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
/**
 * Extracts variable names from text using {{variable}} syntax.
 * @param {string} text - The text to extract variables from.
 * @returns {string[]} Array of unique variable names.
 */
function extractVariables(text) {
  const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
  const vars = [];
  let match;
  while ((match = regex.exec(text))) {
    vars.push(match[1]);
  }
  return Array.from(new Set(vars));
}
/**
 * TextNode
 * Node for editing and displaying text with variable handles.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains label, text)
 */
export const TextNode = ({ id, data }) => {
  // Default data fallback
  const safeData = { label: "Text", text: "Text Input ....", ...data };
  // State for current text value
  const [currText, setCurrText] = useState(safeData.text);
  // Extract variables from text
  const variables = useMemo(() => extractVariables(currText), [currText]);
  // React Flow hooks for manipulating nodes and edges
  const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();
  /**
   * Handles text change and updates node data.
   */
  const handleTextChange = useCallback(
    (e) => {
      const newText = e.target.value;
      setCurrText(newText);

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
  /**
   * Deletes the current node and its connected edges.
   */
  const handleDelete = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();

    setNodes(nodes.filter((node) => node.id !== id));

    setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id));
  }, [id, getNodes, getEdges, setNodes, setEdges]);

  return (
    <div className="p-1 border rounded-lg shadow-md resize min-w-72 bg-cyan-950 border-slate-800">
      {/* Node Header: Label and Delete Button */}
      <div className="flex items-center justify-between p-2 text-gray-100">
        <p className="font-light text-xl tracking-wide text-cyan-100 px-2.5 py-1.5 bg-cyan-950">
          Text {currText?.length}
        </p>
        <button
          onClick={handleDelete}
          className="w-6 h-6 text-sm font-bold duration-200 bg-transparent rounded-full hover:bg-cyan-900 text-cyan-100"
        >
          ✕
        </button>
      </div>
      {/* Editable text area */}
      <label className="flex flex-col gap-2 p-4 bg-gray-950">
        <span className="text-sm">Text:</span>
        <span className="block w-full text-base text-gray-900 bg-white rounded-md outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600">
          <textarea
            style={{
              backgroundColor: "transparent",
              width: "100%",
              paddingInline: "0.75rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.25rem",
              fontSize: "0.75rem",
              lineHeight: "1rem",
            }}
            value={currText}
            onChange={handleTextChange}
            classname="!bg-transparent appearance-none resize"
          />
        </span>
      </label>
      {/* Handles for each variable found in text */}
      {variables.map((v, idx) => (
        <Handle
          key={v}
          type="target"
          position={Position.Left}
          id={`${id}-var-${v}`}
          style={{ top: 40 + idx * 20 }}
        />
      ))}
      {/* Output handle */}
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </div>
  );
};
