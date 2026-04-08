import { useState } from "react";
import { ShieldAlert, Users, Search, Plus, Trash2, LogOut, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("institutions");
  const [institutions, setInstitutions] = useState([
    { id: 1, name: "Harvard University", email: "admin@harvard.edu", status: "Active", addedAt: "2024-03-12" },
    { id: 2, name: "MIT", email: "registrar@mit.edu", status: "Active", addedAt: "2024-03-14" }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInstName, setNewInstName] = useState("");
  const [newInstEmail, setNewInstEmail] = useState("");

  const handleAddInstance = (e) => {
    e.preventDefault();
    if (!newInstName || !newInstEmail) return;
    setInstitutions([...institutions, {
      id: Date.now(),
      name: newInstName,
      email: newInstEmail,
      status: "Active",
      addedAt: new Date().toISOString().split('T')[0]
    }]);
    setNewInstName("");
    setNewInstEmail("");
    setShowAddForm(false);
  };

  const handleRemove = (id) => {
    setInstitutions(institutions.filter(inst => inst.id !== id));
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans flex overflow-hidden">
      
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
            <button
              onClick={() => setActiveTab("institutions")}
              className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "institutions"
                  ? "bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]"
                  : "text-[#8a9bb3] border border-transparent hover:bg-[#0f192b] hover:text-white"
              }`}
            >
              <Users size={18} className={activeTab === "institutions" ? "text-blue-400" : "text-[#8a9bb3]"} />
              Manage Institutions
            </button>
          </nav>
        </div>

        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#8a9bb3] hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all">
          <LogOut size={18} className="text-red-400/80" />
          Secure Logout
        </Link>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Admin Blue Glow Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="p-8 md:p-12 max-w-6xl mx-auto relative">
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Authorized <span className="text-blue-500">Institutions</span></h2>
                <p className="text-[#8a9bb3] text-base">Manage the universities allowed to broadcast globally on the blockchain.</p>
              </div>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] flex items-center gap-2"
              >
                {showAddForm ? <X size={18} /> : <Plus size={18} />}
                {showAddForm ? "Cancel Assignment" : "Assign New Institution"}
              </button>
            </div>

            {/* ADD INSTITUTION FORM */}
            {showAddForm && (
              <div className="mb-10 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="bg-[#0a111a] border border-[#1a2b42] p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                  
                  <h3 className="text-lg font-bold text-white mb-6">Create Authorization Key</h3>
                  <form onSubmit={handleAddInstance} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div>
                      <label className="block text-sm font-semibold text-[#8a9bb3] mb-2">Registered University Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Stanford University"
                        value={newInstName}
                        onChange={(e) => setNewInstName(e.target.value)}
                        className="w-full p-4 bg-[#05080e] border border-[#1a2b42] rounded-xl text-sm font-medium focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.15)] focus:outline-none transition-all placeholder:text-[#2a3c5a] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#8a9bb3] mb-2">Official Google Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. admin@stanford.edu"
                        value={newInstEmail}
                        onChange={(e) => setNewInstEmail(e.target.value)}
                        className="w-full p-4 bg-[#05080e] border border-[#1a2b42] rounded-xl text-sm font-medium focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.15)] focus:outline-none transition-all placeholder:text-[#2a3c5a] text-white"
                      />
                    </div>
                    <div className="md:col-span-2 pt-2">
                      <button type="submit" className="w-full py-4 text-base font-bold rounded-xl transition-all flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.2)]">
                        Whitelist Institution
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* REGISTRY TABLE */}
            <div className="border border-[#1a2b42] rounded-3xl overflow-hidden bg-[#0a111a] shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative z-10">
              <div className="p-5 border-b border-[#1a2b42] bg-[#070b12] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-[#8a9bb3]" />
                  <input 
                    type="text" 
                    placeholder="Search registry..." 
                    className="bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-[#425570] w-64"
                  />
                </div>
                <div className="text-sm font-medium text-[#8a9bb3]">
                  Total Whitelisted: <span className="text-white">{institutions.length}</span>
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
                    {institutions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-[#8a9bb3]">
                          No institutions authorized yet.
                        </td>
                      </tr>
                    ) : (
                      institutions.map((inst) => (
                        <tr key={inst.id} className="hover:bg-[#0f192b] transition-colors">
                          <td className="px-6 py-5 font-bold text-white">{inst.name}</td>
                          <td className="px-6 py-5 font-mono text-xs text-blue-400">{inst.email}</td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs font-semibold text-blue-400">
                              <CheckCircle size={12} /> {inst.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => handleRemove(inst.id)}
                              className="w-9 h-9 inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-[#0a111a] text-[#8a9bb3] hover:text-red-400 hover:bg-red-500/10 border border-[#1a2b42] hover:border-red-500/30 transition-all font-semibold shadow-inner"
                              title="Revoke Access"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
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
