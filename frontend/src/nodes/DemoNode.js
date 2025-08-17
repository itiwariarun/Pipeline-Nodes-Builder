import { useState, useEffect } from "react";
import { Position, useReactFlow } from "reactflow";
import { AbstractNode } from "./abstractNode";
import { fileToBase64 } from "../lib/helper";
/**
 * NumberNode
 * Node for numeric input.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains value)
 */
export const NumberNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [value, setValue] = useState(data?.value || 0);
  // Update node data when value changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, value } } : node
      )
    );
  }, [value, id, setNodes]);
  // Field and handle configuration
  const fields = [
    {
      name: "Number",
      value,
      inputType: "number",
      onChange: setValue,
      maxWidth: "max-w-full",
    },
  ];
  const handles = [
    { type: "source", position: Position.Right, id: `${id}-number` },
  ];

  return (
    <AbstractNode
      id={id}
      label="Number Node"
      fields={fields}
      handles={handles}
    />
  );
};
/**
 * ColorNode
 * Node for color input.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains color)
 */
export const ColorNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [color, setColor] = useState(data?.color || "#ff0000");
  // Update node data when color changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, color } } : node
      )
    );
  }, [color, id, setNodes]);
  // Field and handle configuration
  const fields = [
    {
      name: "Color",
      value: color,
      inputType: "color",
      onChange: setColor,
      maxWidth: "max-w-full",
    },
  ];
  const handles = [
    { type: "source", position: Position.Right, id: `${id}-color` },
  ];

  return (
    <AbstractNode
      id={id}
      label="Color Node"
      fields={fields}
      handles={handles}
    />
  );
};
/**
 * BooleanNode
 * Node for boolean (checkbox) input.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains value)
 */
export const BooleanNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [value, setValue] = useState(data?.value ?? true);
  // Update node data when value changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, value } } : node
      )
    );
  }, [value, id, setNodes]);
  // Field and handle configuration

  const fields = [
    {
      name: "Value",
      value,
      inputType: "checkbox",
      onChange: setValue,
      maxWidth: "max-w-full",
    },
  ];

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-bool` },
  ];

  return (
    <AbstractNode
      id={id}
      label="Boolean Node"
      fields={fields}
      handles={handles}
    />
  );
};
/**
 * MessageNode
 * Node for text message input.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains message)
 */
export const MessageNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [message, setMessage] = useState(data?.message || "Hello");
  // Update node data when message changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, message } } : node
      )
    );
  }, [message, id, setNodes]);
  // Field and handle configuration
  const fields = [
    {
      name: "Message",
      value: message,
      inputType: "textarea",
      onChange: setMessage,
      maxWidth: "max-w-full",
    },
  ];
  const handles = [
    { type: "source", position: Position.Right, id: `${id}-msg` },
  ];

  return (
    <AbstractNode
      id={id}
      label="Message Node"
      fields={fields}
      handles={handles}
    />
  );
};
/**
 * FileNode
 * Node for file upload input.
 * Props:
 * - id: Unique node identifier
 * - data: Node data (contains file)
 */

export const FileNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [file, setFile] = useState(data?.file || null);

  // Update node data when file changes
  useEffect(() => {
    if (!file) return;
    if (file instanceof File) {
      fileToBase64(file).then((base64) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, file: base64 } }
              : node
          )
        );
      });
    } else {
      // file is already base64 (from backend)
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, file } } : node
        )
      );
    }
  }, [file, id, setNodes]);

  const fields = [
    {
      name: "Upload",
      value: file,
      inputType: "file",
      onChange: setFile,
      maxWidth: "max-w-full",
    },
  ];

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-file` },
  ];

  return (
    <AbstractNode id={id} label="File Node" fields={fields} handles={handles} />
  );
};
