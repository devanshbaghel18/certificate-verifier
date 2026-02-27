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
        setBackendStatus("Backend Not Reachable ❌");
      }
    };

    fetchHealth();
  }, []);

  return (
    <div>
      <h1>Welcome to CertiChain</h1>
      <h2>Backend Status: {backendStatus}</h2>

      {details && (
        <div>
          <p>Message: {details.message}</p>
          <p>Uptime: {details.uptime}</p>
        </div>
      )}
    </div>
  );
}

export default Home;