export default function Contact() {
  return (
    <div className="py-24 bg-brand-darker text-white font-sans border-t border-[#1a2c1f]">
      <main className="px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 tracking-tight">Contact <span className="text-brand-green">Us</span></h2>
        <p className="text-[#a3b3a7] text-lg mb-8 font-medium">
          Have questions or need support? Reach out to the CertiChain team.
        </p>
        <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
          <p className="text-gray-400">Please email us at <a href="mailto:support@certichain.com" className="text-brand-green hover:underline">support@certichain.com</a></p>
        </div>
      </main>
    </div>
  );
}
