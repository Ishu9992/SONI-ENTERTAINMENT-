export default function SettingsPage() {
  return (
    <div className="px-6 md:px-14 py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl text-castle-gold mb-8">Settings</h1>

      <section className="bg-castle-surface rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <p className="text-sm text-castle-muted">Manage profile, subscription and playback preferences.</p>
      </section>

      <section className="bg-castle-surface rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">About Soni Entertainment</h2>
        <p className="text-sm text-castle-muted mb-1">Version 1.0.0</p>
        <p className="text-sm text-castle-muted">
          Soni Entertainment is a streaming platform bringing movies, series, short films
          and live TV together in one cinematic home.
        </p>
      </section>

      <div className="battlement-divider my-8" />

      <p className="text-center font-display text-castle-gold text-lg">
        Crafted with excellence by Ishu Soni - Soni Media Studios
      </p>
    </div>
  );
}
