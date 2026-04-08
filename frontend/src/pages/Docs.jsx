import { FileCode2, Database, LayoutGrid, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Docs() {
  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans overflow-hidden">

      {/* HERO */}
      <section className="relative pt-32 lg:pt-40 pb-24 border-b border-[#1a2c1f]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-green/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-brand-green border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,209,90,0.1)] mb-6">
            <Database size={14} /> Developer Guides
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            Platform <span className="text-brand-green drop-shadow-[0_0_20px_rgba(0,209,90,0.3)]">Documentation</span>
          </h1>
          <p className="text-[#a3b3a7] max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Everything you need to understand how CertiChain works, how mathematical hashes are generated natively, and how decentralized verification completes the trust loop securely.
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-24 border-b border-[#1a2c1f] relative">
        <div className="absolute left-0 top-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">System <span className="text-brand-green">Architecture</span></h2>
            <p className="text-[#a3b3a7] text-lg font-medium">Delve into the technical pillars of academic security.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileCode2, title: "Certificate Hashing", text: "Institutions upload certificates which are cryptographically converted into a unique SHA-256 digital fingerprint strictly upon the client device." },
              { icon: Database, title: "Blockchain Storage", text: "Each generated signature is pushed as an immutable transaction to the Ethereum Blockchain, permanently intertwining the identity." },
              { icon: LayoutGrid, title: "Verification Process", text: "Any external user can upload a suspected copy to instantly replay the calculation and verify geometric authenticity against the network." }
            ].map((Doc, i) => (
              <div key={i} className="border border-[#1a2c1f] bg-[#0c1610] p-8 rounded-2xl shadow-xl group hover:border-brand-green/40 transition-all duration-300">
                <Doc.icon size={32} className="text-brand-green mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">{Doc.title}</h3>
                <p className="text-[#a3b3a7] leading-relaxed text-sm font-medium">{Doc.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="py-24 border-b border-[#1a2c1f] relative">
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">How to Use <span className="text-brand-green">CertiChain</span></h2>
            <p className="text-[#a3b3a7] text-lg font-medium">The standard operative protocol for anonymous verification.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", text: "Upload the specific localized PDF document natively within the Verification portal." },
              { step: "02", text: "CertiChain internally constructs the exact SHA-256 cryptographic sequence via the buffer." },
              { step: "03", text: "The network scans the blockchain nodes and returns the mathematical confirmation dynamically." }
            ].map((Guide, i) => (
              <div key={i} className="border border-[#1a2c1f] bg-[#0c1610] p-10 rounded-3xl text-center shadow-xl hover:shadow-[0_10px_30px_rgba(0,209,90,0.1)] transition-all">
                <h3 className="text-brand-green text-5xl font-extrabold mb-6 drop-shadow-[0_0_15px_rgba(0,209,90,0.3)]">
                  {Guide.step}
                </h3>
                <p className="text-[#a3b3a7] font-medium leading-relaxed">
                  {Guide.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API / FUTURE SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/10 via-brand-darker to-brand-darker pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Developer <span className="text-brand-green">Integration APIs</span></h2>
          <p className="text-[#a3b3a7] text-lg leading-relaxed font-medium mb-10 max-w-2xl mx-auto">
            We are actively mapping out high-throughput REST APIs that will allow any collegiate platform or employer suite to integrate issuing and checking natively inside their own codebases.
          </p>
          
          <Link to="/contact">
            <button className="flex items-center justify-center gap-3 px-8 py-3 bg-brand-green text-brand-darker font-bold rounded-xl shadow-[0_4px_20px_rgba(0,209,90,0.3)] hover:shadow-[0_4px_30px_rgba(0,209,90,0.4)] transition-all mx-auto group">
              Express API Interest <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}