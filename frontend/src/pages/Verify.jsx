import { Upload, Search, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { useState } from "react";

function Verify() {
  const [certificateId, setCertificateId] = useState("");
  const [status, setStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      if (!file) return;

      setLoading(true);
      setStatus(null);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:5000/api/certificates/verify",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.valid) {
        setStatus("valid");
        setResult(data);
      } else {
        setStatus("invalid");
      }

    } catch (err) {
      console.error(err);
      setStatus("invalid");
    }

    setLoading(false);
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
            Upload a certificate to verify its authenticity on the blockchain.
          </p>
        </div>
      </section>

      {/* VERIFY SECTION */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">

          {/* Upload Box */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 flex flex-col items-center text-center gap-6 mb-10">

            <Upload size={48} className="text-green-400" />

            <div>
              <h3 className="text-xl font-semibold">
                Upload Certificate
              </h3>
              <p className="text-gray-400">
                Select your certificate PDF file
              </p>
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg cursor-pointer"
            >
              Select File
            </label>

            {file && (
              <p className="text-sm text-gray-400">
                Selected: {file.name}
              </p>
            )}

            <button
              onClick={handleVerify}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg flex items-center gap-2"
            >
              <Search size={18} />
              Verify File
            </button>

            {loading && (
              <p className="text-gray-400 mt-2">Verifying...</p>
            )}

          </div>

          {/* RESULT */}
          {status === "valid" && (
            <div className="mt-10 border border-green-500/40 bg-green-500/10 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-400" />
                <div>
                  <h4 className="font-semibold text-lg">
                    Certificate Verified
                  </h4>
                  <p className="text-gray-400 text-sm">
                    This certificate exists on the blockchain.
                  </p>
                </div>
              </div>

              {/* Metadata */}
              {result && (
                <div className="mt-4 text-sm text-gray-400 space-y-1">
                  <p><span className="text-white">Issuer:</span> {result.certificate?.issuer_name}</p>
                  <p><span className="text-white">Issued At:</span> {result.certificate?.issued_at}</p>
                </div>
              )}
            </div>
          )}

          {status === "invalid" && (
            <div className="mt-10 border border-red-500/40 bg-red-500/10 rounded-xl p-6 flex items-center gap-4">
              <AlertCircle className="text-red-400" />
              <div>
                <h4 className="font-semibold text-lg">
                  Invalid Certificate
                </h4>
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