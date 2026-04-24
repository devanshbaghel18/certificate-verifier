export default function Terms() {
  return (
    <div className="py-24 bg-brand-darker text-white font-sans border-t border-[#1a2c1f]">
      <main className="px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 tracking-tight">Terms of <span className="text-brand-green">Service</span></h2>
        <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-2xl p-8 space-y-4 text-[#a3b3a7] shadow-xl max-w-3xl mx-auto text-left">
          <p>By using CertiChain, you agree to these terms.</p>
          <p>1. The platform provides immutable certificate storage on the blockchain.</p>
          <p>2. Institutions are responsible for the validity of the certificates they issue.</p>
          <p>3. We do not store personally identifiable data on-chain beyond what is strictly necessary for verification.</p>
        </div>
      </main>
    </div>
  );
}
