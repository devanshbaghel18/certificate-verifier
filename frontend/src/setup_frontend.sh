#!/bin/bash

# 1. ViewerLogin.jsx
cat > pages/ViewerLogin.jsx << 'EOF'
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { FileCheck } from "lucide-react";
import { viewerLogin } from "../services/api";

export default function ViewerLogin() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { user } = await viewerLogin(credentialResponse.credential);
      localStorage.setItem("viewerToken", credentialResponse.credential);
      localStorage.setItem("viewerUser", JSON.stringify(user));
      navigate("/verify");
    } catch (err) {
      console.error("Viewer login failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xl font-semibold">CertiChain</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Viewer Login</h1>
          <p className="text-gray-400 text-sm">
            Sign in to verify certificates and track your verification history.
          </p>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-8 space-y-6">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
              theme="outline"
              size="large"
              width="300"
            />
          </div>
          <div className="border-t border-gray-800 pt-4 text-center text-sm text-gray-500">
            Just want to verify without saving history?{" "}
            <Link to="/verify" className="text-green-400 hover:underline">
              Continue without login
            </Link>
          </div>
        </div>
        <div className="flex justify-between mt-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-white transition">← Back to Home</Link>
          <Link to="/institution/login" className="hover:text-white transition">Institution Login →</Link>
        </div>
      </div>
    </div>
  );
}
EOF

# 2. Verify.jsx
cat > pages/Verify.jsx << 'EOF'
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

  const handleVerify = async () => {
    if (!file) return;
    setStatus("loading"); setResult(null);
    try {
      const data = await verifyCertificate(file);
      const isValid = data.valid;
      const certData = data.data || null;
      if (isValid) { setStatus("valid"); setResult(certData); } else { setStatus("invalid"); }
      if (viewerToken) {
        await saveVerificationHistory({
          token: viewerToken, certificateHash: hash, fileName: file.name,
          isValid, issuerName: certData?.issuer_name || null, issuedAt: certData?.issued_at || null,
        });
        fetchHistory();
      }
    } catch (err) { console.error(err); setStatus("invalid"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("viewerToken"); localStorage.removeItem("viewerUser");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-16 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-mono text-green-400 border border-green-500/30 bg-green-500/10 px-3 py-1 rounded-full">
            Open Verification — No login required
          </span>
          <h1 className="text-4xl font-bold mt-4 mb-3">Verify a Certificate</h1>
          <p className="text-gray-400">Upload the PDF — we generate its SHA-256 hash and check it against the blockchain.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 space-y-6">

          {!viewerToken ? (
            <div className="flex items-center justify-between border border-gray-800 rounded-xl px-5 py-3 bg-gray-900/40 text-sm">
              <p className="text-gray-400"><span className="text-white font-medium">Want to save your history?</span> Sign in as a viewer.</p>
              <Link to="/viewer/login" className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors font-medium">
                <LogIn size={14} /> Sign in
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between border border-gray-800 rounded-xl px-5 py-3 bg-gray-900/40 text-sm">
              <div className="flex items-center gap-2">
                {viewerUser?.picture && <img src={viewerUser.picture} className="w-6 h-6 rounded-full" alt="" />}
                <span className="text-gray-300">{viewerUser?.name}</span>
                <span className="text-gray-600">·</span>
                <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1 text-green-400 hover:text-green-300">
                  <History size={13} /> History ({history.length})
                </button>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors text-xs">Sign out</button>
            </div>
          )}

          {showHistory && viewerToken && (
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40">
                <p className="text-sm font-medium">Verification History</p>
              </div>
              {historyLoading ? (
                <div className="p-6 text-center text-gray-600 text-sm"><Loader size={16} className="animate-spin mx-auto mb-2" />Loading...</div>
              ) : history.length === 0 ? (
                <p className="p-6 text-center text-gray-600 text-sm">No verifications yet.</p>
              ) : (
                <div className="divide-y divide-gray-800">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div>
                        <p className="text-gray-300 font-medium">{h.file_name}</p>
                        <p className="text-xs text-gray-600 font-mono mt-0.5">{h.certificate_hash?.slice(0, 24)}...</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {h.is_valid
                          ? <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400">Valid</span>
                          : <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400">Invalid</span>}
                        <span className="text-xs text-gray-600">{new Date(h.verified_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-14 flex flex-col items-center text-center gap-4 cursor-pointer transition-colors ${dragging ? "border-green-500 bg-green-500/5" : "border-gray-700 hover:border-gray-500"}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={40} className="text-green-400" />
              <div>
                <p className="text-lg font-medium">Drop certificate PDF here</p>
                <p className="text-gray-500 text-sm mt-1">or click to browse</p>
              </div>
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileSelect(e.target.files[0])} />
            </div>
          ) : (
            <div className="border border-gray-700 rounded-xl p-5 bg-gray-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <FileText size={18} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={handleRemove} className="text-gray-600 hover:text-red-400 transition-colors"><X size={16} /></button>
              </div>
              {hash && (
                <div className="bg-black border border-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">SHA-256 Hash</p>
                  <p className="text-xs font-mono text-green-400 break-all">{hash}</p>
                </div>
              )}
              <button
                onClick={handleVerify}
                disabled={status === "loading"}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-900 disabled:text-green-700 text-black font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {status === "loading" ? <><Loader size={16} className="animate-spin" /> Checking blockchain...</> : <><Search size={16} /> Verify Certificate</>}
              </button>
            </div>
          )}

          {status === "valid" && (
            <div className="border border-green-500/40 bg-green-500/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={22} className="text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg">Certificate is Valid</h4>
                  <p className="text-gray-400 text-sm">Authentic and recorded on the blockchain.</p>
                </div>
              </div>
              {result && (
                <div className="border-t border-green-500/20 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Issuer</span><span className="text-white">{result.issuer_name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Issued At</span><span className="text-white">{result.issued_at ? new Date(result.issued_at).toLocaleDateString() : "—"}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-gray-400 flex-shrink-0">Hash</span><span className="text-green-400 font-mono text-xs break-all text-right">{result.certificate_hash}</span></div>
                </div>
              )}
            </div>
          )}

          {status === "invalid" && (
            <div className="border border-red-500/40 bg-red-500/10 rounded-xl p-6 flex items-center gap-3">
              <AlertCircle size={22} className="text-red-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-lg">Certificate Not Found</h4>
                <p className="text-gray-400 text-sm">No record found. This certificate may be fake or not yet registered.</p>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default Verify;
EOF

# 3. AppRoutes.jsx
cat > routes/AppRoutes.jsx << 'EOF'
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Verify from "../pages/Verify";
import InstitutionLogin from "../pages/InstitutionLogin";
import ViewerLogin from "../pages/ViewerLogin";
import About from "../pages/About";
import Docs from "../pages/Docs";
import ProtectedLanding from "../pages/ProtectedLanding";
import UniversityDashboard from "../pages/UniversityDashboard";

function AppRoutes() {
  const institutionToken = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/viewer/login" element={<ViewerLogin />} />
      <Route path="/institution/login" element={<InstitutionLogin />} />
      <Route path="/university/dashboard" element={institutionToken ? <UniversityDashboard /> : <ProtectedLanding />} />
    </Routes>
  );
}

export default AppRoutes;
EOF

# 4. Navbar.jsx
cat > components/Navbar.jsx << 'EOF'
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const institutionToken = localStorage.getItem("token");
  const viewerToken = localStorage.getItem("viewerToken");
  const viewerUser = JSON.parse(localStorage.getItem("viewerUser") || "null");

  const handleInstitutionLogout = () => {
    localStorage.removeItem("token");
    navigate("/institution/login");
  };

  const handleViewerLogout = () => {
    localStorage.removeItem("viewerToken");
    localStorage.removeItem("viewerUser");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-green-400 font-bold text-lg">CertiChain</Link>
      <div className="flex items-center gap-6 text-sm">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
        <Link to="/verify" className="text-gray-400 hover:text-white transition-colors">Verify</Link>
        <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>

        {institutionToken && (
          <>
            <Link to="/university/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <button onClick={handleInstitutionLogout} className="text-red-400 hover:text-red-300 transition-colors">Logout</button>
          </>
        )}

        {!institutionToken && viewerToken && (
          <>
            {viewerUser?.picture && <img src={viewerUser.picture} className="w-7 h-7 rounded-full" alt="" />}
            <button onClick={handleViewerLogout} className="text-gray-500 hover:text-red-400 transition-colors">Sign out</button>
          </>
        )}

        {!institutionToken && !viewerToken && (
          <div className="flex items-center gap-3">
            <Link to="/viewer/login" className="text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link to="/institution/login" className="px-4 py-1.5 border border-gray-700 hover:border-green-400 rounded-lg transition-colors">Institution</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
EOF

# 5. api.js
cat > services/api.js << 'EOF'
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const checkHealth = async () => {
  const response = await API.get("/health");
  return response.data;
};

export const issueCertificate = async (formData) => {
  const response = await API.post("/issue-certificate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getIssuedCertificates = async () => {
  const response = await API.get("/certificates");
  return response.data;
};

export const verifyCertificate = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await API.post("/verify-file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const viewerLogin = async (credential) => {
  const response = await API.post("/api/viewer/login", { credential });
  return response.data;
};

export const saveVerificationHistory = async ({ token, certificateHash, fileName, isValid, issuerName, issuedAt }) => {
  const response = await API.post("/api/viewer/history", {
    token, certificateHash, fileName, isValid, issuerName, issuedAt,
  });
  return response.data;
};

export const getVerificationHistory = async (token) => {
  const response = await API.get("/api/viewer/history", { params: { token } });
  return response.data;
};
EOF

echo "✅ All 5 files created successfully"
