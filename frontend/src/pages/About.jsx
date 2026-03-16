import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="pt-32 pb-24 border-b border-gray-800">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold mb-6">
            About
            <span className="text-green-400"> CertiChain</span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            CertiChain is a blockchain-powered platform designed to
            eliminate certificate fraud. By storing certificate hashes
            on the blockchain, institutions can issue credentials that
            are secure, tamper-proof, and instantly verifiable anywhere
            in the world.
          </p>

        </div>

      </section>


      {/* MISSION */}
      <section className="py-24 border-b border-gray-800">

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16">

          <div>
            <h2 className="text-3xl font-semibold mb-4">
              Our Mission
            </h2>

            <p className="text-gray-400">
              The goal of CertiChain is to build trust in academic
              credentials by using blockchain technology. Traditional
              certificates can be forged or manipulated, creating
              problems for institutions, employers, and students.
            </p>

            <p className="text-gray-400 mt-4">
              CertiChain ensures that certificates issued by institutions
              remain authentic and verifiable forever using immutable
              blockchain records.
            </p>

          </div>


          <div className="
            border border-gray-800
            rounded-xl
            flex items-center justify-center
            text-gray-500
            h-64
          ">
            Platform Architecture Visual
          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section className="py-24 border-b border-gray-800">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-4xl mb-4">
              Why CertiChain
            </h2>

            <p className="text-gray-400">
              Secure and transparent credential verification
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            <div className="border border-gray-800 p-8 rounded-xl">

              <h3 className="text-lg font-semibold mb-3">
                Tamper-Proof
              </h3>

              <p className="text-gray-400 text-sm">
                Certificates are protected using blockchain hashing,
                making them impossible to alter or forge.
              </p>

            </div>


            <div className="border border-gray-800 p-8 rounded-xl">

              <h3 className="text-lg font-semibold mb-3">
                Instant Verification
              </h3>

              <p className="text-gray-400 text-sm">
                Anyone can instantly verify a certificate without
                contacting the issuing institution.
              </p>

            </div>


            <div className="border border-gray-800 p-8 rounded-xl">

              <h3 className="text-lg font-semibold mb-3">
                Global Access
              </h3>

              <p className="text-gray-400 text-sm">
                Certificates can be verified anywhere in the world
                using the blockchain record.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* TEAM / PROJECT */}
      <section className="py-24">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl mb-6">
            The Project
          </h2>

          <p className="text-gray-400">
            CertiChain is built as a secure digital infrastructure for
            institutions to issue and verify certificates. By combining
            blockchain technology with a simple verification interface,
            the platform ensures trust, transparency, and long-term
            credential security.
          </p>

        </div>

      </section>

    </div>
  );
}