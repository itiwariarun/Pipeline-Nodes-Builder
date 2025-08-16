import { Handle, useReactFlow } from "reactflow";
import { useCallback } from "react";
/**
 * AbstractNode component
 * Renders a customizable node for React Flow with dynamic fields and handles.
 *
 * Props:
 * - id: Unique node identifier
 * - label: Node label/title
 * - fields: Array of field objects for input rendering
 * - handles: Array of handle objects for connection points
 */
export const AbstractNode = ({ id, label, fields = [], handles = [] }) => {
  // React Flow hooks for manipulating nodes and edges

  const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();

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
    <div className="p-1 text-gray-100 border rounded-lg shadow-md resize min-w-96 bg-cyan-950 border-slate-800">
      {/* Node Header: Label and Delete Button */}

      <div className="flex items-center justify-between p-2 text-gray-100">
        <p className="font-light text-xl tracking-wide text-cyan-100 px-2.5 py-1.5 bg-cyan-950">
          {label}
        </p>
        <button
          onClick={handleDelete}
          className="w-6 h-6 text-sm font-bold duration-200 bg-transparent rounded-full hover:bg-cyan-900 text-cyan-100"
        >
          ✕
        </button>
      </div>

      {/* Node Fields: Render dynamic input fields */}

      <div className="flex flex-wrap items-start justify-between gap-2 px-2 py-4 bg-gray-950">
        {fields.map((f) => (
          <label
            key={f.name}
            className={`p-2.5 flex flex-wrap gap-2 w-full ${
              f.maxWidth || "max-w-[13.5rem]"
            }`}
          >
            <span className="text-sm">{f.name}:</span>
            {/* Render input based on inputType */}

            {f.inputType === "file" ? (
              <>
                <input
                  type="file"
                  className="block w-full h-8 text-sm placeholder-gray-400 bg-white border border-gray-600 rounded-lg cursor-pointer text-gray-950 focus:outline-none focus:border-cyan-600"
                      onChange={(e) => {
        const selectedFile = e.target.files[0];
        f.onChange(selectedFile);
      }}
    />
    {f.value && <p className="text-xs">Selected file: {f.value.name}</p>
                }
              </>
            ) : f.inputType === "select" ? (
              <select
                className="block w-full rounded-md bg-white pl-2 pr-9 pt-1 pb-1.5 h-8 text-gray-950 outline-1 text-xs -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
              >
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : f.inputType === "textarea" ? (
              <textarea
                className="block w-full rounded-md bg-white px-2 pt-1 pb-1.5 text-gray-950 outline-1 text-xs -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 resize-none"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
              />
            ) : f.inputType === "checkbox" ? (
              <input
                type="checkbox"
                checked={f.value}
                onChange={(e) => f.onChange(e.target.checked)}
                className="w-5 h-5"
              />
            ) : f.inputType === "color" ? (
              <input
                type="color"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="w-12 h-8 p-0 border-none cursor-pointer"
              />
            ) : (
              <input
                type={f.inputType || "text"}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="block w-full rounded-md bg-white px-2 pt-1 pb-1.5 h-8 text-gray-950 outline-1 text-xs -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
              />
            )}
          </label>
        ))}
      </div>

      {/* Node Handles: Render connection points */}

      {handles.map((h) => (
        <Handle key={h.id} type={h.type} position={h.position} id={h.id} />
      ))}
    </div>
  );
};
