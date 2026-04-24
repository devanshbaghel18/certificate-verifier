export default function Privacy() {
  return (
    <div className="py-24 bg-brand-darker text-white font-sans border-t border-[#1a2c1f]">
      <main className="px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 tracking-tight">Privacy <span className="text-brand-green">Policy</span></h2>
        <div className="bg-[#0c1610] border border-[#1a2c1f] rounded-2xl p-8 space-y-4 text-[#a3b3a7] shadow-xl max-w-3xl mx-auto text-left">
          <p>Your privacy is important to us.</p>
          <p>Certificates uploaded for validation are hashed client-side and are not permanently stored on our servers unless you are an issuing institution.</p>
          <p>Contact us for data deletion requests.</p>
        </div>
      </main>
    </div>
  );
}
