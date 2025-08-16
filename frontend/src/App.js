// Importing the toolbar, UI, and submit button components for the pipeline app
import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";

// Main App component
function App() {
  return (
    // Container div for the pipeline app
    <div className="max-w-7xl bg-gray-950 relative mx-auto max-h-[50.5rem] border-2 my-20 border-gray-800 rounded-lg overflow-x-hidden">
      {/* Toolbar at the top */}
      <PipelineToolbar />
      {/* Main UI area */}
      <PipelineUI />
      {/* Submit button at the bottom */}
      <SubmitButton />
    </div>
  );
}

// Exporting App as default
export default App;
