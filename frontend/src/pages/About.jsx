import { Shield, Lock, Globe, Flag } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans overflow-hidden">

      {/* HERO */}
      <section className="relative pt-32 lg:pt-40 pb-24 border-b border-[#1a2c1f]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-green/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-brand-green border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,209,90,0.1)] mb-6">
            <Flag size={14} /> Our Vision
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            About <span className="text-brand-green drop-shadow-[0_0_20px_rgba(0,209,90,0.3)]">CertiChain</span>
          </h1>
          <p className="text-[#a3b3a7] max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            CertiChain is a blockchain-powered platform designed to eliminate certificate fraud permanently. By storing cryptographic hashes on distributed ledgers, institutions can issue credentials that are inherently secure, tamper-proof, and instantly verifiable anywhere in the world.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 border-b border-[#1a2c1f] relative">
        <div className="absolute left-0 top-1/2 w-64 h-64 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Our <span className="text-brand-green">Mission</span>
            </h2>
            <p className="text-[#a3b3a7] text-lg leading-relaxed">
              The overarching goal of CertiChain is to build absolute trust in academic and professional credentials using Ethereum smart contracts. Traditional certificates can be forged or manipulated, creating immense friction for institutions, employers, and legitimate students.
            </p>
            <p className="text-[#a3b3a7] text-lg leading-relaxed">
              CertiChain ensures that every document issued remains authentic and verifiable forever using immutable blockchain records, completely removing the need for slow, manual background checks.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-brand-green/20 rounded-3xl blur-[40px] group-hover:bg-brand-green/30 transition-all duration-700"></div>
            <div className="h-80 border border-[#1a2c1f] rounded-3xl bg-[#0c1610] shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-[#a3b3a7] relative overflow-hidden">
               {/* Abstract nodes simulation */}
               <div className="absolute inset-x-0 inset-y-0 opacity-20 pointer-events-none">
                  <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-brand-green shadow-[0_0_15px_#00D15A]"></div>
                  <div className="absolute bottom-10 right-20 w-6 h-6 rounded-full bg-brand-green shadow-[0_0_15px_#00D15A]"></div>
                  <div className="absolute top-20 right-10 w-3 h-3 rounded-full bg-brand-green shadow-[0_0_15px_#00D15A]"></div>
                  <div className="absolute bottom-20 left-20 w-5 h-5 rounded-full bg-brand-green shadow-[0_0_15px_#00D15A]"></div>
                  
                  {/* Lines */}
                  <svg className="w-full h-full stroke-brand-green stroke-1">
                     <line x1="20%" y1="20%" x2="50%" y2="50%" />
                     <line x1="80%" y1="80%" x2="50%" y2="50%" />
                     <line x1="80%" y1="20%" x2="50%" y2="50%" />
                     <line x1="20%" y1="80%" x2="50%" y2="50%" />
                  </svg>
               </div>
               
               <Shield size={64} className="text-brand-green mb-4 drop-shadow-[0_0_15px_rgba(0,209,90,0.5)] relative z-10" />
               <span className="font-bold tracking-widest uppercase text-sm relative z-10">Immutable Ledger Visualized</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 border-b border-[#1a2c1f] relative">
        <div className="absolute right-0 top-1/2 w-64 h-64 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Why Choose <span className="text-brand-green">CertiChain?</span>
            </h2>
            <p className="text-[#a3b3a7] text-lg font-medium">Securing the world's most important credentials.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: "Tamper-Proof", text: "Certificates are protected using complex cryptographic hashes, mathematically making them impossible to alter or forge." },
              { icon: Shield, title: "Instant Verification", text: "Anyone can instantly verify a certificate without playing phone-tag or emailing the issuing institution." },
              { icon: Globe, title: "Global Access", text: "Blockchain operates across borders. Certificates can be immediately verified globally with 100% uptime." }
            ].map((Feature, i) => (
              <div key={i} className="border border-[#1a2c1f] bg-[#0c1610] p-8 rounded-2xl shadow-xl hover:shadow-[0_10px_30px_rgba(0,209,90,0.1)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-brand-green/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Feature.icon size={28} className="text-brand-green" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{Feature.title}</h3>
                <p className="text-[#a3b3a7] leading-relaxed font-medium">{Feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM / PROJECT */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-green/5 via-brand-darker to-brand-darker pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">The Core <span className="text-brand-green">Infrastructure</span></h2>
          <p className="text-[#a3b3a7] text-lg leading-relaxed font-medium">
            CertiChain acts as the bleeding-edge digital infrastructure for institutional integrity. By coupling Web3 transparency with a streamlined user interface, the platform guarantees trust and long-term assurance for degrees around the globe.
          </p>
        </div>
      </section>

    </div>
  );
}