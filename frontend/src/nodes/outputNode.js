import { useState, useEffect } from "react";
import { Position, useReactFlow } from "reactflow";
import { AbstractNode } from "./abstractNode";
/**
 * OutputNode
 * Node for text or file output.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains outputName, outputType, file)
 */
export const OutputNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  // State for output name, type, and file
  const [currName, setCurrName] = useState(data?.outputName || "");
  const [outputType, setOutputType] = useState(data?.outputType || "Text");
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
              outputName: currName,
              outputType,
              file,
            },
          };
        }
        return node;
      })
    );
  }, [currName, outputType, file, id, setNodes]);
  // Field configuration for AbstractNode
  const fields = [
    {
      name: "Name",
      value: outputType === "File" ? file : currName,
      inputType: outputType === "File" ? "file" : "text",
      onChange: (value) =>
        outputType === "File" ? setFile(value) : setCurrName(value),
      maxWidth: "max-w-[13.5rem]",
    },
    {
      name: "Type",
      value: outputType,
      inputType: "select",
      options: ["Text", "File"],
      onChange: (value) => setOutputType(value),
      maxWidth: "max-w-[8rem]",
    },
  ];
  // Handle configuration for AbstractNode
  const handles = [
    { type: "target", position: Position.Left, id: `${id}-value` },
  ];

  return (
    <AbstractNode
      id={id}
      label={`${outputType} Output`}
      fields={fields}
      handles={handles}
    />
  );
};
