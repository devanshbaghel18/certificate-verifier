import { useEffect, useState } from "react";
import { getVerificationHistory } from "../services/api";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { History as HistoryIcon, ShieldCheck, ShieldAlert } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("viewerToken");
      if (!token) {
        navigate("/viewer/login");
        return;
      }
      try {
        const data = await getVerificationHistory(token);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans">
      <Navbar />
      <main className="pt-40 px-8 max-w-5xl mx-auto pb-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#0c1810] p-2.5 rounded-xl border border-brand-green/30 shadow-[0_0_15px_rgba(0,209,90,0.1)]">
            <HistoryIcon className="text-brand-green w-7 h-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Verification <span className="text-brand-green">History</span></h1>
        </div>

        {loading ? (
          <div className="text-[#a3b3a7] text-lg animate-pulse">Loading your history...</div>
        ) : history.length === 0 ? (
          <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-2xl p-12 text-center space-y-6">
            <p className="text-[#a3b3a7] text-lg">No verification history found.</p>
            <Link to="/verify">
              <button className="px-8 py-3 bg-brand-green hover:bg-brand-greenHover text-brand-darker font-bold rounded-lg shadow-[0_4px_20px_rgba(0,209,90,0.4)] transition-all">Verify a Certificate</button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#111f15] border-b border-[#1a2c1f]">
                  <tr>
                    <th className="py-5 px-6 text-[#a3b3a7] font-semibold text-sm uppercase tracking-wide">Status</th>
                    <th className="py-5 px-6 text-[#a3b3a7] font-semibold text-sm uppercase tracking-wide">File Name / Hash</th>
                    <th className="py-5 px-6 text-[#a3b3a7] font-semibold text-sm uppercase tracking-wide">Issuer Details</th>
                    <th className="py-5 px-6 text-[#a3b3a7] font-semibold text-sm uppercase tracking-wide">Verified On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a2c1f]">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-[#15251a] transition-colors group">
                      <td className="py-5 px-6">
                        {record.is_valid ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                            <ShieldCheck size={14} /> Valid
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                            <ShieldAlert size={14} /> Invalid
                          </div>
                        )}
                      </td>
                      <td className="py-5 px-6 text-sm">
                        <div className="truncate max-w-[200px] sm:max-w-xs text-gray-200 font-medium" title={record.file_name}>{record.file_name || "Unknown"}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1.5 break-all truncate max-w-[200px] sm:max-w-xs">{record.certificate_hash}</div>
                      </td>
                      <td className="py-5 px-6 text-sm text-gray-300">
                        {record.issuer_name || <span className="text-gray-500 italic">Unknown Issuer</span>}<br/>
                        <span className="text-xs text-gray-500 mt-1 block">{record.issued_at ? new Date(record.issued_at).toLocaleDateString() : ""}</span>
                      </td>
                      <td className="py-5 px-6 text-sm text-[#a3b3a7]">
                        {new Date(record.verified_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
