import { Upload, Search, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { useState } from "react";

function Verify() {
  const [certificateId, setCertificateId] = useState("");
  const [status, setStatus] = useState(null);

  const handleVerify = () => {
    if (!certificateId) return;

    // temporary demo logic
    if (certificateId === "12345") {
      setStatus("valid");
    } else {
      setStatus("invalid");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      

      {/* HERO */}
      <section className="pt-32 pb-20 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h1 className="text-4xl font-bold mb-4">
            Verify Certificate
          </h1>

          <p className="text-gray-400">
            Upload a certificate or enter the certificate ID to verify its authenticity on the blockchain.
          </p>

        </div>
      </section>

      {/* VERIFY SECTION */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">

          {/* Upload Box */}
          <div className="
            border-2 border-dashed border-gray-700
            rounded-xl p-12
            flex flex-col items-center
            text-center gap-6 mb-10
          ">

            <Upload size={48} className="text-green-400" />

            <div>
              <h3 className="text-xl font-semibold">
                Upload Certificate
              </h3>

              <p className="text-gray-400">
                Drag and drop your certificate PDF
              </p>
            </div>

            <button className="
              px-6 py-3
              bg-green-500 hover:bg-green-600
              rounded-lg
            ">
              Select File
            </button>

          </div>


          {/* OR Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 border-t border-gray-800"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-800"></div>
          </div>


          {/* Certificate ID Input */}
          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className="
                flex-1
                px-4 py-3
                bg-black
                border border-gray-700
                rounded-lg
                focus:border-green-400
                outline-none
              "
            />

            <button
              onClick={handleVerify}
              className="
                px-6 py-3
                bg-green-500 hover:bg-green-600
                rounded-lg
                flex items-center gap-2
              "
            >
              <Search size={18} />
              Verify
            </button>

          </div>


          {/* Verification Result */}
          {status === "valid" && (
            <div className="
              mt-10
              border border-green-500/40
              bg-green-500/10
              rounded-xl
              p-6
              flex items-center gap-4
            ">
              <CheckCircle className="text-green-400" />
              <div>
                <h4 className="font-semibold">Certificate Verified</h4>
                <p className="text-gray-400 text-sm">
                  This certificate exists on the blockchain.
                </p>
              </div>
            </div>
          )}

          {status === "invalid" && (
            <div className="
              mt-10
              border border-red-500/40
              bg-red-500/10
              rounded-xl
              p-6
              flex items-center gap-4
            ">
              <AlertCircle className="text-red-400" />
              <div>
                <h4 className="font-semibold">Invalid Certificate</h4>
                <p className="text-gray-400 text-sm">
                  This certificate was not found on the blockchain.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

export default Verify;