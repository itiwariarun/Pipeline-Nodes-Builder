// DraggableNode is a React component that renders a draggable node for use in a flow editor.
// Props:
//   type: string - used for styling and identifying the node type
//   label: string - text label displayed inside the node

export const DraggableNode = ({ type, label }) => {
  // Handles the drag start event for the node
  // Sets the cursor style and attaches node type data to the drag event
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }; // Prepare data to transfer
    event.target.style.cursor = "grabbing"; // Change cursor to grabbing
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData) // Attach node type data for React Flow
    );
    event.dataTransfer.effectAllowed = "move"; // Allow moving the node
  };

  return (
    // Render a draggable div representing the node
    <div
      onDragStart={(event) => onDragStart(event, type)} // Attach drag start handler
      onDragEnd={(event) => (event.target.style.cursor = "grab")} // Reset cursor on drag end
      className={`py-1 px-2.5 ${type}`} // Apply styling and type class
      draggable // Make the div draggable
    >
      {/* Display the node label */}
      <span className="font-medium text-cyan-100">{label}</span>
    </div>
  );
};
