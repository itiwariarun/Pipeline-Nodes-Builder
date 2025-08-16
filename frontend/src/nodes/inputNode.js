import { useState, useEffect } from "react";
import { Position, useReactFlow } from "reactflow";
import { AbstractNode } from "./abstractNode";
/**
 * InputNode
 * Node for text or file input.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains inputName, inputType, file)
 */
export const InputNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  // State for input name, type, and file

  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");
  const [file, setFile] = useState(data?.file || null);
  // Update node data when any field changes

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              inputName: currName,
              inputType,
              file,
            },
          };
        }
        return node;
      })
    );
  }, [currName, inputType, file, id, setNodes]);
  // Field configuration for AbstractNode

  const fields = [
    {
      name: "Name",
      value: inputType === "File" ? file : currName,
      inputType: inputType === "File" ? "file" : "text",
      onChange: (v) => (inputType === "File" ? setFile(v) : setCurrName(v)),
      maxWidth: "max-w-[13.5rem]",
    },
    {
      name: "Type",
      value: inputType,
      inputType: "select",
      options: ["Text", "File"],
      onChange: (v) => setInputType(v),
      maxWidth: "max-w-[8rem]",
    },
  ];
  // Handle configuration for AbstractNode

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-value` },
  ];

  return (
    <AbstractNode
      id={id}
      label={`${inputType} Input`}
      fields={fields}
      handles={handles}
    />
  );
};
