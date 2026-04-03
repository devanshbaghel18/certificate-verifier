import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, FilePlus, FileText, LogOut, Upload, X, CheckCircle, AlertCircle, Loader } from "lucide-react";
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

  // Generate SHA-256 hash from file
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
    ;

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
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-64 border-r border-gray-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-green-400">CertiChain</h1>
            <p className="text-xs text-gray-500 mt-1">University Portal</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active === id
                    ? "bg-green-500/20 text-green-400 font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10 overflow-y-auto">

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
            <p className="text-gray-500 text-sm mb-8">Welcome back. Here's what's happening.</p>

            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {[
                { label: "Certificates Issued", value: stats.issued, color: "text-green-400" },
                { label: "Verified", value: stats.verified, color: "text-green-400" },
                { label: "Pending", value: stats.pending, color: "text-yellow-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="border border-gray-800 p-6 rounded-xl bg-gray-900/40">
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="border border-gray-800 rounded-xl p-6 bg-gray-900/20">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Quick Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setActive("issue")}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black text-sm font-medium rounded-lg transition-colors"
                >
                  Issue New Certificate
                </button>
                <button
                  onClick={() => setActive("records")}
                  className="px-4 py-2 border border-gray-700 hover:border-gray-500 text-sm rounded-lg transition-colors"
                >
                  View Records
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ISSUE CERTIFICATE */}
        {active === "issue" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Issue Certificate</h2>
            <p className="text-gray-500 text-sm mb-8">
              Upload a PDF — a SHA-256 hash will be generated and stored on-chain.
            </p>

            <div className="max-w-2xl space-y-5">

              {/* PDF Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Certificate PDF</label>

                {!pdfFile ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      dragging ? "border-green-500 bg-green-500/5" : "border-gray-700 hover:border-gray-500"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={28} className="mx-auto mb-3 text-gray-500" />
                    <p className="text-sm text-gray-400">Drag & drop PDF here or <span className="text-green-400 underline">browse</span></p>
                    <p className="text-xs text-gray-600 mt-1">Only PDF files accepted</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </div>
                ) : (
                  <div className="border border-gray-700 rounded-xl p-4 bg-gray-900/40">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <FileText size={16} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{pdfFile.name}</p>
                          <p className="text-xs text-gray-500">{(pdfFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button onClick={handleRemoveFile} className="text-gray-600 hover:text-red-400 transition-colors">
                        <X size={16} />
                      </button>
                    </div>

                    {/* Hash display */}
                    {hash && (
                      <div className="bg-black border border-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">SHA-256 Hash</p>
                        <p className="text-xs font-mono text-green-400 break-all">{hash}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Student Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Devansh Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full p-3 bg-black border border-gray-700 rounded-lg text-sm focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Course</label>
                  <input
                    type="text"
                    placeholder="e.g. Blockchain Development"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full p-3 bg-black border border-gray-700 rounded-lg text-sm focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Certificate ID</label>
                <input
                  type="text"
                  placeholder="e.g. CERT-2024-001"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg text-sm focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Status message */}
              {issueStatus && issueStatus !== "loading" && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  issueStatus === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}>
                  {issueStatus === "success"
                    ? <CheckCircle size={16} />
                    : <AlertCircle size={16} />
                  }
                  {issueMessage}
                </div>
              )}

              <button
                onClick={handleIssue}
                disabled={issueStatus === "loading"}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-900 disabled:text-green-700 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {issueStatus === "loading" ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Issuing...
                  </>
                ) : (
                  "Issue Certificate"
                )}
              </button>
            </div>
          </div>
        )}

        {/* RECORDS */}
        {active === "records" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Issued Records</h2>
            <p className="text-gray-500 text-sm mb-8">All certificates issued by your institution.</p>

            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-800 bg-gray-900/40">
                  <tr>
                    <th className="p-4 text-gray-400 font-medium">ID</th>
                    <th className="p-4 text-gray-400 font-medium">Issuer</th>
                    <th className="p-4 text-gray-400 font-medium">Hash</th>
                    <th className="p-4 text-gray-400 font-medium">Issued At</th>
                  </tr>
                </thead>
                <tbody>
                  {recordsLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-600">
                        <Loader size={20} className="animate-spin mx-auto mb-2" />
                        Loading records...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-600">
                        No certificates issued yet. Go to <span className="text-green-400 cursor-pointer" onClick={() => setActive("issue")}>Issue Certificate</span> to get started.
                      </td>
                    </tr>
                  ) : (
                    records.map((record, i) => (
                      <tr key={i} className="border-b border-gray-800 last:border-0 hover:bg-gray-900/40 transition-colors">
                        <td className="p-4 font-mono text-xs text-gray-300">{record.id}</td>
                        <td className="p-4">{record.issuer_name}</td>
                        <td className="p-4 font-mono text-xs text-green-400 max-w-[180px] truncate" title={record.certificate_hash}>
                          {record.certificate_hash?.slice(0, 20)}...
                        </td>
                        <td className="p-4 text-gray-400 text-xs">
                          {new Date(record.issued_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
