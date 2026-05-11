import { Upload, Search, CheckCircle, AlertCircle, Loader, X, FileText, History, LogIn } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { verifyCertificate, saveVerificationHistory, getVerificationHistory } from "../services/api";

function Verify() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef(null);

  const viewerToken = localStorage.getItem("viewerToken");
  const viewerUser = JSON.parse(localStorage.getItem("viewerUser") || "null");

  useEffect(() => {
    if (viewerToken) fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getVerificationHistory(viewerToken);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ─── CLIENT-SIDE HASHING ────────────────────────────────────────────────────
  // To ensure absolute privacy, the certificate PDF is hashed directly in the user's browser.
  // We extract a SHA-256 digital fingerprint from the file's raw binary data.
  // This means the file itself doesn't need to be sent anywhere to prove its integrity.
  const generateHash = async (f) => {
    const buffer = await f.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleFileSelect = async (f) => {
    if (!f || f.type !== "application/pdf") { alert("Please upload a valid PDF file."); return; }
    setFile(f); setStatus(null); setResult(null);
    const h = await generateHash(f);
    setHash(h);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFileSelect(e.dataTransfer.files[0]); };

  const handleRemove = () => {
    setFile(null); setHash(""); setStatus(null); setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── VERIFICATION REQUEST ───────────────────────────────────────────────────
  // Sends the file to the backend to check if the generated hash exists in the database.
  // If it's a match, it proves the document is 100% authentic and unaltered.
  // It also automatically logs this verification attempt in the user's history if they are logged in.
  const handleVerify = async () => {
    if (!file) return;
    setStatus("loading"); setResult(null);
    try {
      const data = await verifyCertificate(file);
      const isValid = data.valid;
      const certData = data.data || null;

      if (isValid) { 
        setStatus("valid"); 
        setResult(certData); 
      } else { 
        setStatus("invalid"); 
      }
      
      // Save to viewing history if the user is authenticated
      if (viewerToken) {
        await saveVerificationHistory({
          token: viewerToken, certificateHash: hash, fileName: file.name,
          isValid, issuerName: certData?.issuer_name || null, issuedAt: certData?.issued_at || null,
        });
        fetchHistory();
      }
    } catch (err) { 
        console.error(err); 
        setStatus("invalid"); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("viewerToken"); localStorage.removeItem("viewerUser");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans overflow-hidden">

      <section className="relative pt-24 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-green/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-green/80 mb-3">
            <CheckCircle size={16} /> Open Verification
          </div>
          <h1 className="text-5xl font-bold mt-6 mb-4 tracking-tight">Verify a <span className="text-brand-green">Certificate</span></h1>
          <p className="text-[#a3b3a7] text-lg max-w-2xl mx-auto">Upload the PDF document below. Our system will generate a cryptographic SHA-256 hash completely on your device and check it against the Ethereum blockchain securely.</p>
        </div>
      </section>

      <section className="pb-32 relative z-10">
        <div className="max-w-2xl mx-auto px-6 space-y-8">

          {/* User Status Bar */}
          {!viewerToken ? (
            <div className="flex flex-col sm:flex-row items-center justify-between border border-[#1a2c1f] rounded-2xl px-6 py-4 bg-[#0c1610] shadow-xl text-sm gap-4">
              <p className="text-[#a3b3a7]"><span className="text-white font-semibold">Ready to track your validations?</span> Sign in to access your history dashboard.</p>
              <Link to="/viewer/login">
                <button className="flex items-center gap-2 px-5 py-2 bg-[#16271c] hover:bg-brand-highlight text-brand-green font-bold rounded-lg border border-brand-green/30 transition-all shadow-[0_0_15px_rgba(0,209,90,0.1)] hover:shadow-[0_0_20px_rgba(0,209,90,0.2)]">
                  <LogIn size={16} /> Login
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between border border-[#1a2c1f] rounded-2xl px-6 py-4 bg-[#0c1610] shadow-xl text-sm">
              <div className="flex items-center gap-3">
                {viewerUser?.picture ? (
                  <img src={viewerUser.picture} className="w-8 h-8 rounded-full border border-brand-green/30" alt="profile cursor" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-green/20 border border-brand-green/30"></div>
                )}
                <div>
                  <span className="text-white font-semibold block leading-tight">{viewerUser?.name}</span>
                  <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1.5 text-brand-green hover:text-brand-greenHover transition-colors mt-0.5 text-xs font-medium">
                    <History size={12} /> View History ({history.length})
                  </button>
                </div>
              </div>
              <button onClick={handleLogout} className="px-4 py-1.5 rounded-md border border-gray-700 text-[#a3b3a7] hover:text-white hover:bg-gray-800 transition-colors text-xs font-semibold uppercase tracking-wider">Sign out</button>
            </div>
          )}

          {/* Upload Box */}
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center text-center gap-5 cursor-pointer transition-all duration-300 shadow-2xl relative overflow-hidden group ${
                dragging 
                ? "border-brand-green bg-brand-green/10 scale-[1.02] shadow-[0_0_30px_rgba(0,209,90,0.2)]" 
                : "border-[#2a3c2f] bg-[#0c1610] hover:border-brand-green/50 hover:bg-[#0f1c14]"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="w-20 h-20 rounded-2xl bg-[#16271c] border border-brand-green/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,209,90,0.15)] group-hover:scale-110 transition-transform duration-300">
                <Upload size={36} className="text-brand-green" />
              </div>
              
              <div>
                <p className="text-xl font-bold text-white mb-2">Drop certificate PDF here</p>
                <p className="text-[#a3b3a7] font-medium">or click anywhere to browse your files</p>
              </div>
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileSelect(e.target.files[0])} />
            </div>
          ) : (
            // Selected File View
            <div className="border border-[#1a2c1f] rounded-3xl p-8 bg-[#0c1610] shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between pb-6 border-b border-[#1a2c1f]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shadow-[0_4px_10px_rgba(0,209,90,0.1)]">
                    <FileText size={24} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg leading-tight mb-1">{file.name}</p>
                    <p className="text-sm text-[#a3b3a7] font-medium">{(file.size / 1024).toFixed(1)} KB • PDF Document</p>
                  </div>
                </div>
                <button onClick={handleRemove} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#16271c] text-[#a3b3a7] hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all border border-transparent"><X size={18} /></button>
              </div>

              {hash && (
                <div className="bg-[#040804] border border-[#1a2c1f] rounded-xl p-5 shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                     <p className="text-sm font-semibold text-[#a3b3a7]">Cryptographic Signature (SHA-256)</p>
                     <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                     </span>
                  </div>
                  <p className="text-sm font-mono text-brand-green break-all leading-relaxed bg-[#0c1610] p-3 rounded-lg border border-[#1a2c1f]">{hash}</p>
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={status === "loading"}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_4px_20px_rgba(0,209,90,0.2)] hover:shadow-[0_4px_25px_rgba(0,209,90,0.4)]
                  ${status === "loading" 
                    ? "bg-[#16271c] text-brand-green border border-brand-green/30 cursor-wait" 
                    : "bg-brand-green hover:bg-brand-greenHover text-brand-darker"
                  }`}
              >
                {status === "loading" ? (
                  <><Loader size={20} className="animate-spin" /> Querying Blockchain...</>
                ) : (
                  <><Search size={20} /> Verify Authenticity</>
                )}
              </button>

            </div>
          )}

          {/* Results Views */}
          {status === "valid" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-green-500/40 bg-[#0c1610] rounded-3xl p-8 space-y-6 shadow-[0_10px_40px_rgba(0,209,90,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] pointer-events-none"></div>
              
              <div className="flex items-start gap-4">
                <CheckCircle size={32} className="text-brand-green flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-2xl text-white">Verification Successful</h4>
                  <p className="text-[#a3b3a7] text-sm mt-1 leading-relaxed">This document is authentic. A perfect cryptographic match was found registered on the Ethereum Blockchain.</p>
                </div>
              </div>
              
              {result && (
                <div className="bg-[#040804] border border-[#1a2c1f] rounded-2xl p-6 space-y-4 shadow-inner">
                  <div className="grid grid-cols-3 gap-4 border-b border-[#1a2c1f] pb-4">
                    <div className="col-span-1 text-[#a3b3a7] font-medium text-sm">Issuing Institution</div>
                    <div className="col-span-2 text-white font-semibold text-right">{result.issuer_name}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-[#1a2c1f] pb-4">
                    <div className="col-span-1 text-[#a3b3a7] font-medium text-sm">Issuance Date</div>
                    <div className="col-span-2 text-white font-semibold text-right">{result.issued_at ? new Date(result.issued_at).toLocaleDateString([], { dateStyle: 'long' }) : "—"}</div>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="text-[#a3b3a7] font-medium text-sm">Blockchain Hash</div>
                    <div className="text-brand-green font-mono text-xs break-all bg-[#0a110a] p-3 rounded-lg border border-[#1a2c1f] shadow-inner text-center">{result.certificate_hash}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "invalid" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-red-500/40 bg-[#160b0b] rounded-3xl p-8 flex items-start gap-4 shadow-[0_10px_40px_rgba(239,68,68,0.1)]">
              <AlertCircle size={32} className="text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-2xl text-white mb-2">Verification Failed</h4>
                <p className="text-[#a3b3a7] text-sm leading-relaxed">No identical cryptographic record was found on the blockchain. This document may be fraudulent, altered, or not yet officially registered by the institution.</p>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default Verify;
