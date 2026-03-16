export default function Docs() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="pt-32 pb-24 border-b border-gray-800">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold mb-6">
            CertiChain
            <span className="text-green-400"> Documentation</span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to understand how CertiChain works,
            how certificates are issued, and how verification happens
            securely using blockchain technology.
          </p>

        </div>

      </section>


      {/* OVERVIEW */}
      <section className="py-24 border-b border-gray-800">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-4xl mb-4">
              Platform Overview
            </h2>

            <p className="text-gray-400">
              Learn how CertiChain secures academic credentials
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            {/* DOC CARD 1 */}
            <div className="border border-gray-800 p-8 rounded-xl">

              <h3 className="text-lg font-semibold mb-3">
                Certificate Issuing
              </h3>

              <p className="text-gray-400 text-sm">
                Institutions upload certificates which are converted
                into cryptographic hashes and stored securely on
                the blockchain.
              </p>

            </div>


            {/* DOC CARD 2 */}
            <div className="border border-gray-800 p-8 rounded-xl">

              <h3 className="text-lg font-semibold mb-3">
                Blockchain Storage
              </h3>

              <p className="text-gray-400 text-sm">
                Each certificate hash is written to the blockchain,
                ensuring the record cannot be altered or deleted.
              </p>

            </div>


            {/* DOC CARD 3 */}
            <div className="border border-gray-800 p-8 rounded-xl">

              <h3 className="text-lg font-semibold mb-3">
                Verification Process
              </h3>

              <p className="text-gray-400 text-sm">
                Anyone can upload a certificate or enter its ID
                to instantly verify authenticity using the
                blockchain record.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* HOW TO USE */}
      <section className="py-24 border-b border-gray-800">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-4xl mb-4">
              How to Use CertiChain
            </h2>

            <p className="text-gray-400">
              Step-by-step process to verify certificates
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            <div className="border border-gray-800 p-8 rounded-xl text-center">

              <h3 className="text-green-400 text-3xl font-bold mb-4">
                01
              </h3>

              <p className="text-gray-400 text-sm">
                Upload the certificate PDF or paste the certificate ID.
              </p>

            </div>


            <div className="border border-gray-800 p-8 rounded-xl text-center">

              <h3 className="text-green-400 text-3xl font-bold mb-4">
                02
              </h3>

              <p className="text-gray-400 text-sm">
                CertiChain generates a SHA-256 cryptographic hash.
              </p>

            </div>


            <div className="border border-gray-800 p-8 rounded-xl text-center">

              <h3 className="text-green-400 text-3xl font-bold mb-4">
                03
              </h3>

              <p className="text-gray-400 text-sm">
                The system checks the blockchain record and confirms
                certificate authenticity instantly.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* API / FUTURE SECTION */}
      <section className="py-24">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl mb-6">
            Developer Integration
          </h2>

          <p className="text-gray-400">
            CertiChain will provide APIs that allow institutions
            to integrate certificate issuing and verification
            directly into their systems.
          </p>

        </div>

      </section>

    </div>
  );
}