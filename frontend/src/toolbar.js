// PipelineToolbar component renders the toolbar for building pipelines
// It displays draggable node types for use in the flow editor

import { DraggableNode } from "./draggableNode";

export const PipelineToolbar = () => {
  return (
    // Toolbar container
    <div className="flex flex-col gap-2 p-4 text-gray-100 border-b border-gray-800 bg-slate-950">
      {/* Toolbar title */}
      <p className="p-2 text-2xl font-medium text-cyan-100">Build Pipeline</p>
      {/* Draggable node options */}
      <div className="flex flex-wrap items-center gap-4">
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="number" label="Number" />
        <DraggableNode type="color" label="Color" />
        <DraggableNode type="boolean" label="Boolean" />
        <DraggableNode type="message" label="Message" />
        <DraggableNode type="file" label="File" />
      </div>
    </div>
  );
};
