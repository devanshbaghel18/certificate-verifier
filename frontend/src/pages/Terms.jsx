import Navbar from "../components/Navbar";

export default function Terms() {
  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans">
      <Navbar />
      <main className="pt-40 px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms of <span className="text-brand-green">Service</span></h1>
        <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-2xl p-8 space-y-4 text-[#a3b3a7]">
          <p>By using CertiChain, you agree to these terms.</p>
          <p>1. The platform provides immutable certificate storage on the blockchain.</p>
          <p>2. Institutions are responsible for the validity of the certificates they issue.</p>
          <p>3. We do not store personally identifiable data on-chain beyond what is strictly necessary for verification.</p>
        </div>
      </main>
    </div>
  );
}
