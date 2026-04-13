import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ShieldAlert, Users, Search, Trash2, LogOut, CheckCircle, Clock, XCircle, X, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { getAdminInstitutions, updateAdminInstitutionStatus, deleteAdminInstitution } from "../../services/api";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("all"); // all | pending | approved | rejected
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  // Fetch real data from the backend
  const fetchInstitutions = async () => {
    try {
      if (!adminToken) return;
      const data = await getAdminInstitutions(adminToken);
      setInstitutions(data);
    } catch (err) {
      console.error("Failed to fetch institutions:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    fetchInstitutions();
  }, []);

  // Socket.IO real-time listener
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

    socket.on("new_institution_request", (institution) => {
      setToast(institution);
      // Append to list if not already present
      setInstitutions((prev) => {
        const exists = prev.find(i => i.id === institution.id);
        if (exists) return prev;
        return [institution, ...prev];
      });
      // Auto-dismiss toast after 8 seconds
      setTimeout(() => setToast(null), 8000);
    });

    return () => socket.disconnect();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateAdminInstitutionStatus(id, newStatus, adminToken);
      setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, status: updated.status } : inst));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminInstitution(id, adminToken);
      setInstitutions(prev => prev.filter(inst => inst.id !== id));
    } catch (err) {
      console.error("Failed to delete institution:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Filtering logic
  const filtered = institutions.filter(inst => {
    const matchesTab = filterTab === "all" || inst.status === filterTab;
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inst.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = institutions.filter(i => i.status === "pending").length;

  const statusConfig = {
    pending: { icon: Clock, label: "Pending", badge: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" },
    approved: { icon: CheckCircle, label: "Approved", badge: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
    rejected: { icon: XCircle, label: "Rejected", badge: "bg-red-500/10 border-red-500/30 text-red-400" },
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans flex overflow-hidden">

      {/* LIVE TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right fade-in duration-500">
          <div className="bg-[#0a111a] border border-yellow-500/40 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(234,179,8,0.1)] max-w-sm relative">
            <button onClick={() => setToast(null)} className="absolute top-3 right-3 text-[#8a9bb3] hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-yellow-400 mb-1">New Access Request</p>
                <p className="text-white font-semibold text-sm">{toast.name}</p>
                <p className="text-[#8a9bb3] text-xs font-mono mt-1">{toast.email}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { handleStatusChange(toast.id, "approved"); setToast(null); }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => { handleStatusChange(toast.id, "rejected"); setToast(null); }}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-72 bg-[#060a0f] border-r border-[#101b2b] p-6 flex flex-col justify-between hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#0b1421] p-2 rounded-lg border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
              <ShieldAlert className="text-blue-500 w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">CertiChain</h1>
              <p className="text-xs text-blue-400 mt-0.5 tracking-wider uppercase font-semibold">Master Admin</p>
            </div>
          </div>

          <nav className="space-y-3">
            {[
              { key: "all", label: "All Institutions", icon: Users },
              { key: "pending", label: "Pending Approvals", icon: Clock },
              { key: "approved", label: "Approved", icon: CheckCircle },
              { key: "rejected", label: "Rejected", icon: XCircle },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filterTab === tab.key
                    ? "bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]"
                    : "text-[#8a9bb3] border border-transparent hover:bg-[#0f192b] hover:text-white"
                }`}
              >
                <tab.icon size={18} className={filterTab === tab.key ? "text-blue-400" : "text-[#8a9bb3]"} />
                {tab.label}
                {tab.key === "pending" && pendingCount > 0 && (
                  <span className="ml-auto bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full border border-yellow-500/30">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#8a9bb3] hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all">
          <LogOut size={18} className="text-red-400/80" />
          Secure Logout
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="p-8 md:p-12 max-w-6xl mx-auto relative">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  {filterTab === "all" && <>Authorized <span className="text-blue-500">Institutions</span></>}
                  {filterTab === "pending" && <>Pending <span className="text-yellow-400">Approvals</span></>}
                  {filterTab === "approved" && <>Approved <span className="text-blue-500">Institutions</span></>}
                  {filterTab === "rejected" && <>Rejected <span className="text-red-400">Requests</span></>}
                </h2>
                <p className="text-[#8a9bb3] text-base">Manage the universities allowed to broadcast globally on the blockchain.</p>
              </div>
            </div>

            {/* REGISTRY TABLE */}
            <div className="border border-[#1a2b42] rounded-3xl overflow-hidden bg-[#0a111a] shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative z-10">
              <div className="p-5 border-b border-[#1a2b42] bg-[#070b12] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-[#8a9bb3]" />
                  <input
                    type="text"
                    placeholder="Search registry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-[#425570] w-64"
                  />
                </div>
                <div className="text-sm font-medium text-[#8a9bb3]">
                  Total: <span className="text-white">{filtered.length}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#05080e]">
                    <tr>
                      <th className="px-6 py-5 text-[#8a9bb3] font-semibold uppercase tracking-wider text-xs">University</th>
                      <th className="px-6 py-5 text-[#8a9bb3] font-semibold uppercase tracking-wider text-xs">Auth Email</th>
                      <th className="px-6 py-5 text-[#8a9bb3] font-semibold uppercase tracking-wider text-xs">Status</th>
                      <th className="px-6 py-5 text-[#8a9bb3] font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a2b42]">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-[#8a9bb3]">
                          Loading institution registry...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-[#8a9bb3]">
                          {searchQuery ? "No matching institutions found." : "No institutions in this category yet."}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((inst) => {
                        const sc = statusConfig[inst.status] || statusConfig.pending;
                        const StatusIcon = sc.icon;
                        return (
                          <tr key={inst.id} className="hover:bg-[#0f192b] transition-colors">
                            <td className="px-6 py-5 font-bold text-white">{inst.name}</td>
                            <td className="px-6 py-5 font-mono text-xs text-blue-400">{inst.email}</td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-lg text-xs font-semibold ${sc.badge}`}>
                                <StatusIcon size={12} /> {sc.label}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {inst.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(inst.id, "approved")}
                                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(inst.id, "rejected")}
                                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 transition-all"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {inst.status === "rejected" && (
                                  <button
                                    onClick={() => handleStatusChange(inst.id, "approved")}
                                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30 transition-all"
                                  >
                                    Re-approve
                                  </button>
                                )}
                                {inst.status === "approved" && (
                                  <button
                                    onClick={() => handleStatusChange(inst.id, "rejected")}
                                    className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-bold rounded-lg border border-yellow-500/30 transition-all"
                                  >
                                    Revoke
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(inst.id)}
                                  className="w-8 h-8 inline-flex flex-shrink-0 items-center justify-center rounded-lg bg-[#0a111a] text-[#8a9bb3] hover:text-red-400 hover:bg-red-500/10 border border-[#1a2b42] hover:border-red-500/30 transition-all"
                                  title="Permanently Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
