import { ShieldAlert, Info, AlertTriangle, FileText, Globe } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-16 border-b border-[#1a2c1f]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.1)]">
            <ShieldAlert size={14} /> Legal Notice
          </span>
          <h1 className="text-5xl font-bold mt-6 mb-4 tracking-tight">
            Project <span className="text-red-400">Disclaimer</span>
          </h1>
          <p className="text-[#a3b3a7] text-lg max-w-2xl mx-auto leading-relaxed">
            Important information regarding the nature, purpose, and limitations of the CertiChain platform.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-6 space-y-12">

          <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold">1. Educational & Demonstration Purpose</h2>
            </div>
            <div className="space-y-4 text-[#a3b3a7] leading-relaxed">
              <p>
                CertiChain is an open-source project developed primarily for <strong>educational and demonstration</strong>.
              </p>
              <p>
                While the underlying cryptography (SHA-256 hashing) and blockchain integration (Ethereum smart contracts) utilize real-world cryptographic standards, this specific deployment is a proof-of-concept. The smart contracts may be deployed on test networks (like Sepolia or Hardhat localhost) rather than the Ethereum Mainnet.
              </p>
            </div>
          </div>

          <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-brand-green/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
                <FileText size={24} className="text-brand-green" />
              </div>
              <h2 className="text-2xl font-bold">2. Verification Accuracy</h2>
            </div>
            <div className="space-y-4 text-[#a3b3a7] leading-relaxed">
              <p>
                A "Verification Successful" result indicates that the exact digital fingerprint (hash) of the uploaded document matches a record stored on our blockchain registry.
              </p>
              <p>
                However, CertiChain does <strong>not</strong> independently verify the real-world accreditation status of the issuing institutions. It solely verifies that the institution (identified by their blockchain wallet/account) issued that specific document. Always cross-reference with the institution directly if absolute real-world validation is critical.
              </p>
            </div>
          </div>

          <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Info size={24} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">3. No Liability</h2>
            </div>
            <div className="space-y-4 text-[#a3b3a7] leading-relaxed">
              <p>
                The creators, contributors, and maintainers of CertiChain assume <strong>no liability</strong> for any damages, losses, or legal disputes arising from the use or misuse of this platform.
              </p>
              <p>
                This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </div>
          </div>

          <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Globe size={24} className="text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold">4. Data Privacy & Local Processing</h2>
            </div>
            <div className="space-y-4 text-[#a3b3a7] leading-relaxed">
              <p>
                When verifying a document via the public portal, the PDF file itself is <strong>never uploaded or stored on our servers</strong>. The cryptographic hashing happens locally within your web browser. Only the resulting 64-character hash is sent to the blockchain for comparison.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="pb-24 text-center">
        <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-brand-green hover:text-white transition-colors font-semibold group cursor-pointer">
          <span className="inline-block group-hover:-translate-x-1 transition-transform">←</span> Return to Home
        </a>
      </section>

    </div>
  );
}
