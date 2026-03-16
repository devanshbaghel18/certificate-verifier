import { Link } from "react-router-dom";
import { Upload, Lock, CheckCircle, FileCheck } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

    

      {/* HERO */}
      <section className="pt-32 pb-24 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-8">

              <h1 className="text-5xl font-bold leading-tight">
                Trust Certificates.
                <br />
                <span className="text-green-400">
                  Instantly.
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-xl">
                CertiChain is a blockchain-based certificate verification
                platform that ensures academic credentials are secure,
                tamper-proof, and instantly verifiable.
              </p>

              <div className="flex gap-4">

                <Link to="/verify">
                  <button className="
                    px-6 py-3
                    bg-green-500
                    hover:bg-green-600
                    rounded-lg
                    flex items-center gap-2
                  ">
                    <FileCheck size={20} />
                    Verify Certificate
                  </button>
                </Link>

                <Link to="/institution/login">
                  <button className="
                    px-6 py-3
                    border border-gray-700
                    hover:border-green-400
                    rounded-lg
                  ">
                    For Institutions
                  </button>
                </Link>

              </div>

            </div>


            {/* RIGHT SIDE VISUAL */}
            <div className="hidden lg:flex justify-center">

              <div className="
                w-80 h-80
                border border-gray-800
                rounded-xl
                flex items-center justify-center
                text-gray-500
              ">
                Blockchain Visualization
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* VERIFICATION DEMO */}
      <section className="py-24 border-b border-gray-800">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl mb-4">
            Instant Verification
          </h2>

          <p className="text-gray-400 mb-12">
            Upload a certificate PDF or paste the certificate ID
          </p>


          <div className="
            border-2 border-dashed border-gray-700
            rounded-xl
            p-16
            flex flex-col items-center gap-6
          ">

            <Upload size={48} className="text-green-400" />

            <div>
              <h3 className="text-xl font-semibold">
                Upload Certificate
              </h3>

              <p className="text-gray-400">
                Drop PDF here or click to browse
              </p>
            </div>

            <Link to="/verify">
              <button className="
                px-6 py-3
                bg-green-500
                hover:bg-green-600
                rounded-lg
              ">
                Select File
              </button>
            </Link>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="py-24 border-b border-gray-800">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-4xl mb-4">
              How It Works
            </h2>

            <p className="text-gray-400">
              Blockchain powered certificate validation
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            {/* STEP 1 */}
            <div className="border border-gray-800 p-8 rounded-xl">

              <Upload className="text-green-400 mb-4" size={32} />

              <h3 className="text-lg font-semibold mb-2">
                Upload Certificate
              </h3>

              <p className="text-gray-400 text-sm">
                The certificate file is uploaded and converted
                into a SHA-256 cryptographic hash.
              </p>

            </div>


            {/* STEP 2 */}
            <div className="border border-gray-800 p-8 rounded-xl">

              <Lock className="text-green-400 mb-4" size={32} />

              <h3 className="text-lg font-semibold mb-2">
                Stored on Blockchain
              </h3>

              <p className="text-gray-400 text-sm">
                The certificate hash is permanently stored on
                the Ethereum blockchain.
              </p>

            </div>


            {/* STEP 3 */}
            <div className="border border-gray-800 p-8 rounded-xl">

              <CheckCircle className="text-green-400 mb-4" size={32} />

              <h3 className="text-lg font-semibold mb-2">
                Instant Verification
              </h3>

              <p className="text-gray-400 text-sm">
                Anyone can verify the certificate authenticity
                instantly using the blockchain record.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* STATS */}
      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-10 text-center">

            <div>
              <h3 className="text-4xl font-bold text-green-400">
                00
              </h3>
              <p className="text-gray-400 mt-2">
                Certificates Issued
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-green-400">
                00
              </h3>
              <p className="text-gray-400 mt-2">
                Institutions
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-green-400">
                00
              </h3>
              <p className="text-gray-400 mt-2">
                Verifications
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}