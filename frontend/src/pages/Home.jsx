import { Link } from "react-router-dom";
import { Shield, FileCheck2, ShieldCheck } from "lucide-react";
export default function Home() {
  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans overflow-hidden">

      <main className="relative pt-32 lg:pt-40 pb-24 px-8 max-w-[1400px] mx-auto min-h-screen flex items-center">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-[30rem] h-[30rem] bg-brand-green/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full z-10 relative">
          
          {/* Left Text Content */}
          <div className="space-y-10 max-w-xl">
            <h1 className="text-[4rem] sm:text-[5.5rem] font-bold leading-[1.05] tracking-tight">
              Trust Certificates.<br />
              <span className="text-brand-green drop-shadow-[0_0_20px_rgba(0,209,90,0.3)]">
                Instantly.
              </span>
            </h1>

            <p className="text-[#a3b3a7] text-lg sm:text-xl leading-relaxed max-w-[90%] font-medium">
              Secure, tamper-proof digital certificate verification powered by blockchain technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-2">
              <Link to="/verify" className="flex-1 sm:flex-none">
                <button className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-brand-green hover:bg-brand-greenHover text-brand-darker font-bold text-lg rounded-xl shadow-[0_8px_30px_rgba(0,209,90,0.25)] transition-all group">
                  <FileCheck2 size={24} className="group-hover:scale-110 transition-transform" />
                  Verify Certificate
                </button>
              </Link>

              <Link to="/institution/login" className="flex-1 sm:flex-none">
                <button className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-transparent border border-brand-green/40 hover:border-brand-green text-white font-bold text-lg rounded-xl hover:bg-brand-highlight/30 transition-all group backdrop-blur-sm shadow-[0_4px_20px_rgba(0,209,90,0.05)] hover:shadow-[0_4px_20px_rgba(0,209,90,0.15)]">
                  <Shield size={24} className="text-brand-green group-hover:drop-shadow-[0_0_8px_rgba(0,209,90,0.8)] transition-all" />
                  For Institutions
                </button>
              </Link>
            </div>

            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#1a2d20] bg-[#0c1610] rounded-lg text-[#6bba84] text-sm font-semibold tracking-wide shadow-inner">
                <ShieldCheck size={16} className="text-brand-green" />
                On-Chain Verified
              </div>
            </div>
          </div>

          {/* Right Visual Content */}
          <div className="flex justify-center lg:justify-end relative">
            <div className="w-[450px] h-[450px] lg:w-[500px] lg:h-[500px] bg-[#0d1610] border border-[#1a2c1f] rounded-3xl p-8 relative overflow-hidden shadow-2xl flex items-center justify-center group pointer-events-none">
              
              {/* Green bracket accents (top-left, bottom-right) */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-brand-green/60 rounded-tl-lg"></div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-brand-green/60 rounded-br-lg"></div>

              {/* Abstract Blockchain Diagram Simulation */}
              <div className="relative w-full h-full">
                {/* Simulated connection lines */}
                <svg width="100%" height="100%" className="absolute inset-0 z-0 opacity-20">
                  <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#00D15A" strokeWidth="2" />
                  <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#00D15A" strokeWidth="2" />
                  <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="#00D15A" strokeWidth="2" />
                  <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="#00D15A" strokeWidth="2" />
                  <line x1="30%" y1="50%" x2="70%" y2="50%" stroke="#00D15A" strokeWidth="2" />
                  <line x1="50%" y1="30%" x2="50%" y2="70%" stroke="#00D15A" strokeWidth="2" />
                  <line x1="20%" y1="20%" x2="30%" y2="50%" stroke="#00D15A" strokeWidth="2" />
                  <line x1="80%" y1="20%" x2="70%" y2="50%" stroke="#00D15A" strokeWidth="2" />
                  <line x1="20%" y1="80%" x2="50%" y2="70%" stroke="#00D15A" strokeWidth="2" />
                </svg>

                {/* Simulated Nodes */}
                {[
                  { top: '15%', left: '15%', size: 'w-16 h-16' },
                  { top: '15%', left: '75%', size: 'w-12 h-12' },
                  { top: '75%', left: '15%', size: 'w-14 h-14' },
                  { top: '75%', left: '75%', size: 'w-16 h-16' },
                  { top: '45%', left: '45%', size: 'w-20 h-20' }, // Center
                  { top: '45%', left: '20%', size: 'w-12 h-12' },
                  { top: '45%', left: '65%', size: 'w-14 h-14' },
                  { top: '25%', left: '45%', size: 'w-12 h-12' },
                  { top: '65%', left: '45%', size: 'w-14 h-14' },
                ].map((node, i) => (
                  <div 
                    key={i}
                    className={`absolute rounded-full bg-gradient-to-br from-[#1c2e22] to-[#0a110a] border-[0.5px] border-brand-green/20 shadow-[inset_-2px_-2px_10px_rgba(0,0,0,0.5),0_0_15px_rgba(0,209,90,0.1)] ${node.size} transform transition-transform duration-1000 group-hover:scale-105`}
                    style={{ top: node.top, left: node.left }}
                  >
                     {/* Node Inner Glow */}
                     <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-brand-green/5 to-transparent blur-[2px]"></div>
                  </div>
                ))}

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}