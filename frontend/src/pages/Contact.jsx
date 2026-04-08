import Navbar from "../components/Navbar";

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-darker text-white font-sans">
      <Navbar />
      <main className="pt-40 px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact <span className="text-brand-green">Us</span></h1>
        <p className="text-[#a3b3a7] text-lg mb-8">
          Have questions or need support? Reach out to the CertiChain team.
        </p>
        <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-2xl p-8">
          <p className="text-gray-400">Please email us at <a href="mailto:support@certichain.com" className="text-brand-green hover:underline">support@certichain.com</a></p>
        </div>
      </main>
    </div>
  );
}
