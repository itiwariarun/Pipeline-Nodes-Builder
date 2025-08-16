import { useStore } from "./store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// SubmitButton component handles submitting nodes and edges to the backend
export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes); // Get nodes from store
  const edges = useStore((state) => state.edges); // Get edges from store
  const [toast, setToast] = useState(null); // Toast state for feedback

  // Show toast message for success or error
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000); // auto hide after 3s
  };

  // Handle submit button click
  const handleSubmit = async () => {
    try {
      // Prepare nodes and edges for safe submission
      const safeNodes = nodes.map(({ id, type, data, position }) => ({
        id,
        type,
        data,
        position,
      }));

      const safeEdges = edges.map(({ id, source, target, type }) => ({
        id,
        source,
        target,
        type,
      }));
      // Send POST request to backend

      const res = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes: safeNodes, edges: safeEdges }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errText}`);
      }
      // Parse response and show result in toast
      const result = await res.json();
      showToast(
        `Nodes: ${result.num_nodes}, Edges: ${result.num_edges}, DAG: ${
          result.is_dag ? "Yes" : "No"
        }`,
        true
      );
    } catch (error) {
      console.error("Submit failed:", error);
      showToast("Something went wrong while submitting", false);
    }
  };

  return (
    <>
      {/* Submit button */}
      <div className="flex justify-start w-full bg-gray-950">
        <button
          type="button"
          className="px-10 py-2 text-cyan-100 rounded-tr-lg bg-cyan-950"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {/* Toast notification for feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
              ${toast.success ? "bg-green-100" : "bg-red-100"}
            `}
          >
            {/* Icon for success or error */}
            <span
              className={!toast.success ? "text-green-900" : "text-red-900"}
            >
              {toast.success ? "✅" : "❌"}
            </span>

            {/* Toast message */}
            <span className={toast.success ? "text-green-900" : "text-red-800"}>
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
