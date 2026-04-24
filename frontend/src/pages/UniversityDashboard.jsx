import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, FilePlus, FileText, LogOut, Upload, X, CheckCircle, AlertCircle, Loader, Shield } from "lucide-react";
import { issueCertificate, getIssuedCertificates } from "../services/api";

export default function UniversityDashboard() {
  const [active, setActive] = useState("dashboard");

  // Issue form state
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [hash, setHash] = useState("");
  const [dragging, setDragging] = useState(false);
  const [issueStatus, setIssueStatus] = useState(null); // null | "loading" | "success" | "error"
  const [issueMessage, setIssueMessage] = useState("");

  // Records state
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  // Stats (derived from records)
  const [stats, setStats] = useState({ issued: 0, verified: 0, pending: 0 });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (active === "records" || active === "dashboard") {
      fetchRecords();
    }
  }, [active]);

  const fetchRecords = async () => {
    setRecordsLoading(true);
    try {
      const data = await getIssuedCertificates();
      setRecords(data);
      setStats({
        issued: data.length,
        verified: data.filter((r) => r.status === "verified").length,
        pending: data.filter((r) => r.status !== "verified").length,
      });
    } catch {

    } finally {
      setRecordsLoading(false);
    }
  };

  // ─── FILE PROCESSING ──────────────────────────────────────────────────────────
  // Takes the uploaded PDF file and generates a cryptographic SHA-256 hash.
  // This happens entirely on the client-side (no server needed yet). 
  // This hash represents the "digital fingerprint" of the exact file contents.
  const generateHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleFileSelect = async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setPdfFile(file);
    setHash("");
    const generatedHash = await generateHash(file);
    setHash(generatedHash);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInput = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setHash("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleIssue = async () => {
    if (!studentName || !course || !certificateId || !pdfFile) {
      setIssueStatus("error");
      setIssueMessage("Please fill all fields and upload a PDF.");
      return;
    }

    setIssueStatus("loading");
    setIssueMessage("");

    const formData = new FormData();
    formData.append("student", studentName);
    formData.append("course", course);
    formData.append("institution", certificateId);
    formData.append("file", pdfFile);

    try {
      await issueCertificate(formData);
      setIssueStatus("success");
      setIssueMessage("Certificate issued and hash stored successfully.");
      setStudentName("");
      setCourse("");
      setCertificateId("");
      setPdfFile(null);
      setHash("");
    } catch (err) {
      setIssueStatus("error");
      setIssueMessage(err?.response?.data?.message || "Failed to issue certificate. Check your backend.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "issue", label: "Issue Certificate", icon: FilePlus },
    { id: "records", label: "Records", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-72 bg-[#080d09] border-r border-[#1a2c1f] p-6 flex flex-col justify-between hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#0c1810] p-2 rounded-lg border border-brand-green/30 shadow-[0_0_10px_rgba(0,209,90,0.1)]">
              <Shield className="text-brand-green w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">CertiChain</h1>
              <p className="text-xs text-[#a3b3a7] mt-0.5 tracking-wider uppercase">University Portal</p>
            </div>
          </div>

          <nav className="space-y-3">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  active === id
                    ? "bg-brand-green/10 border border-brand-green/30 text-brand-green shadow-[inset_0_0_12px_rgba(0,209,90,0.1)]"
                    : "text-[#a3b3a7] border border-transparent hover:bg-[#16271c] hover:text-white"
                }`}
              >
                <Icon size={18} className={active === id ? "text-brand-green" : "text-[#a3b3a7]"} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#a3b3a7] hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all"
        >
          <LogOut size={18} className="text-red-400/80" />
          Logout safely
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="p-8 md:p-12 max-w-6xl mx-auto relative">

          {/* DASHBOARD */}
          {active === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard <span className="text-brand-green">Overview</span></h2>
              <p className="text-[#a3b3a7] text-base mb-10">Welcome back. Here's what's happening with your certificates.</p>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { label: "Certificates Issued", value: stats.issued, color: "text-white" },
                  { label: "Global Verifications", value: stats.verified, color: "text-brand-green" },
                  { label: "Pending Analytics", value: stats.pending, color: "text-amber-400" },
                ].map(({ label, value, color }, i) => (
                  <div key={label} className="border border-[#1a2c1f] p-8 rounded-2xl bg-[#0c1610] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm group-hover:blur-none group-hover:opacity-20 transition-all">
                      <LayoutDashboard size={48} className="text-brand-green" />
                    </div>
                    <p className="text-[#a3b3a7] text-sm uppercase tracking-wider font-semibold">{label}</p>
                    <p className={`text-5xl font-bold mt-4 drop-shadow-md ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="border border-[#1a2c1f] rounded-2xl p-8 bg-[#0c1610] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><LayoutDashboard className="text-brand-green w-5 h-5"/> Quick Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <button
                    onClick={() => setActive("issue")}
                    className="px-6 py-3 bg-brand-green hover:bg-brand-greenHover text-brand-darker text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(0,209,90,0.3)] hover:shadow-[0_4px_20px_rgba(0,209,90,0.4)] flex items-center gap-2 justify-center"
                  >
                    <FilePlus size={18} />
                    Issue New Certificate
                  </button>
                  <button
                    onClick={() => setActive("records")}
                    className="px-6 py-3 border border-brand-green/30 hover:border-brand-green hover:bg-[#16271c] text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 justify-center shadow-sm"
                  >
                    <FileText size={18} className="text-brand-green" />
                    View Issued Records
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ISSUE CERTIFICATE */}
          {active === "issue" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Issue <span className="text-brand-green">Certificate</span></h2>
              <p className="text-[#a3b3a7] text-base mb-10 max-w-2xl">
                Upload a student's document. The system will securely hash the PDF natively and register the immutable signature onto the Blockchain.
              </p>

              <div className="max-w-3xl space-y-8 bg-[#0c1610] border border-[#1a2c1f] p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* PDF Upload */}
                <div className="relative z-10">
                  <label className="block text-sm font-semibold text-white mb-3">Certified PDF Document</label>

                  {!pdfFile ? (
                    <div
                      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                        dragging ? "border-brand-green bg-brand-green/10 scale-[1.01] shadow-[0_0_20px_rgba(0,209,90,0.15)]" : "border-[#2a3c2f] bg-[#0c1610] hover:border-brand-green/50 hover:bg-[#0f1c14]"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#16271c] border border-brand-green/20 flex items-center justify-center shadow-inner">
                         <Upload size={28} className="text-brand-green" />
                      </div>
                      <p className="text-base font-medium text-white mb-1">Drag & drop PDF here</p>
                      <p className="text-sm text-[#a3b3a7]">or click to <span className="text-brand-green hover:underline">browse files</span></p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </div>
                  ) : (
                    <div className="border border-[#1a2c1f] rounded-2xl p-6 bg-[#0c1610] shadow-inner space-y-4">
                      <div className="flex items-center justify-between border-b border-[#1a2c1f] pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
                            <FileText size={20} className="text-brand-green" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-white">{pdfFile.name}</p>
                            <p className="text-xs font-semibold text-[#a3b3a7] uppercase tracking-wide">{(pdfFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button onClick={handleRemoveFile} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#16271c] text-[#a3b3a7] hover:text-white hover:bg-red-500/20 transition-all"><X size={16} /></button>
                      </div>

                      {/* Hash display */}
                      {hash && (
                        <div className="bg-[#040804] border border-[#1a2c1f] rounded-xl p-4">
                           <p className="text-xs font-semibold text-[#a3b3a7] mb-1.5 flex justify-between">Calculated Blockchain Payload <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-brand-green opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span></span></p>
                          <p className="text-xs font-mono text-brand-green break-all leading-relaxed p-2 bg-[#0a110a] rounded border border-[#1a2c1f]">{hash}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div>
                    <label className="block text-sm font-semibold text-[#a3b3a7] mb-2">Student Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full p-4 bg-[#040804] border border-[#1a2c1f] rounded-xl text-sm font-medium focus:border-brand-green focus:shadow-[0_0_10px_rgba(0,209,90,0.1)] focus:outline-none transition-all placeholder:text-[#2a3c2f]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#a3b3a7] mb-2">Academic Course</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science B.S."
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full p-4 bg-[#040804] border border-[#1a2c1f] rounded-xl text-sm font-medium focus:border-brand-green focus:shadow-[0_0_10px_rgba(0,209,90,0.1)] focus:outline-none transition-all placeholder:text-[#2a3c2f]"
                    />
                  </div>
                </div>

                <div className="relative z-10">
                  <label className="block text-sm font-semibold text-[#a3b3a7] mb-2">Registration ID</label>
                  <input
                    type="text"
                    placeholder="e.g. CERT-2024-001"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="w-full p-4 bg-[#040804] border border-[#1a2c1f] rounded-xl text-sm font-medium focus:border-brand-green focus:shadow-[0_0_10px_rgba(0,209,90,0.1)] focus:outline-none transition-all placeholder:text-[#2a3c2f]"
                  />
                </div>

                {/* Status message */}
                {issueStatus && issueStatus !== "loading" && (
                  <div className={`relative z-10 flex items-center gap-3 p-4 rounded-xl text-sm font-medium border ${
                    issueStatus === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_4px_10px_rgba(0,209,90,0.1)]"
                      : "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_4px_10px_rgba(239,68,68,0.1)]"
                  }`}>
                    {issueStatus === "success"
                      ? <CheckCircle size={18} className="flex-shrink-0"/>
                      : <AlertCircle size={18} className="flex-shrink-0"/>
                    }
                    {issueMessage}
                  </div>
                )}

                <div className="pt-2 relative z-10">
                  <button
                    onClick={handleIssue}
                    disabled={issueStatus === "loading"}
                    className={`w-full py-4 text-base font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(0,209,90,0.2)] hover:shadow-[0_4px_30px_rgba(0,209,90,0.3)]
                      ${issueStatus === "loading" 
                        ? "bg-[#16271c] text-brand-green border border-brand-green/30 cursor-wait" 
                        : "bg-brand-green hover:bg-brand-greenHover text-brand-darker"
                      }`}
                  >
                    {issueStatus === "loading" ? (
                      <><Loader size={20} className="animate-spin" /> Registering on Blockchain...</>
                    ) : (
                      "Issue & Broadcast Certificate"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RECORDS */}
          {active === "records" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Issued <span className="text-brand-green">Records</span></h2>
              <p className="text-[#a3b3a7] text-base mb-10">A permanent ledger of all certificates deployed by your institution.</p>

              <div className="border border-[#1a2c1f] rounded-2xl overflow-hidden bg-[#0c1610] shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-[#1a2c1f] bg-[#040804]">
                      <tr>
                        <th className="px-6 py-5 text-[#a3b3a7] font-semibold uppercase tracking-wider text-xs">Certificate ID</th>
                        <th className="px-6 py-5 text-[#a3b3a7] font-semibold uppercase tracking-wider text-xs">Institution</th>
                        <th className="px-6 py-5 text-[#a3b3a7] font-semibold uppercase tracking-wider text-xs">On-Chain Hash</th>
                        <th className="px-6 py-5 text-[#a3b3a7] font-semibold uppercase tracking-wider text-xs text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a2c1f]">
                      {recordsLoading ? (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-[#a3b3a7]">
                            <Loader size={24} className="animate-spin mx-auto mb-4 text-brand-green" />
                            Loading blockchain ledger...
                          </td>
                        </tr>
                      ) : records.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-[#a3b3a7] text-base">
                            Your institutional ledger is currently empty. Go to <span className="text-brand-green font-semibold cursor-pointer hover:underline" onClick={() => setActive("issue")}>Issue Certificate</span> to broadcast your first entry.
                          </td>
                        </tr>
                      ) : (
                        records.map((record, i) => (
                          <tr key={i} className="hover:bg-[#16271c] transition-colors group">
                            <td className="px-6 py-5 font-semibold text-white">{record.id}</td>
                            <td className="px-6 py-5 text-gray-300">{record.issuer_name}</td>
                            <td className="px-6 py-5">
                              <span className="inline-block px-3 py-1.5 bg-[#0a110a] border border-[#1a2c1f] rounded-lg font-mono text-xs text-brand-green max-w-[200px] truncate shadow-inner group-hover:bg-[#0c1610]" title={record.certificate_hash}>
                                {record.certificate_hash?.slice(0, 24)}...
                              </span>
                            </td>
                            <td className="px-6 py-5 text-[#a3b3a7] text-right font-medium">
                              {new Date(record.issued_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric'})}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
