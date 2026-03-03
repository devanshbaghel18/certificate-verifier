import { useEffect, useState } from "react";
import { checkHealth } from "../services/api";

function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await checkHealth();
        setBackendStatus(data.status);
        setDetails(data);
      } catch (error) {
        setBackendStatus("Offline");
      }
    };

    fetchHealth();
  }, []);

  const isOnline = backendStatus === "OK";

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6 border-b border-white pb-4">
          CertiChain
        </h1>

        <p className="text-gray-400 mb-12">
          Blockchain-based certificate verification platform.
        </p>

        {/* Backend Status */}
        <div className="border border-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Backend Status</h2>

          <div className="flex justify-between mb-3">
            <span>Status</span>
            <span className={isOnline ? "text-white" : "text-gray-500"}>
              {backendStatus}
            </span>
          </div>

          {details && (
            <>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Message</span>
                <span>{details.message}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Uptime</span>
                <span>{Math.floor(details.uptime)} sec</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;