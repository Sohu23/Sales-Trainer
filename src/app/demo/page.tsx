import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="text-white hover:underline mb-6 inline-block"
        >
          ← Zurück zur Startseite
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Demo: Outbound Sales Trainer
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            Erlebe, wie KI-gestütztes Sales-Training funktioniert. Interaktive
            Rollenspiele, Echtzeit-Feedback und messbare Erfolge.
          </p>

          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gray-600 text-lg">
                Demo-Video wird geladen...
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-lg mb-2">
                Realistische Szenarien
              </h3>
              <p className="text-gray-600">
                Simuliere echte Verkaufsgespräche mit KI-Personas
              </p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">
                Sofortiges Feedback
              </h3>
              <p className="text-gray-600">
                Erhalte detailliertes Feedback zu deiner Performance
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold text-lg mb-2">Fortschritt tracken</h3>
              <p className="text-gray-600">
                Verfolge deine Verbesserungen über Zeit
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/register"
              className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-purple-700 transition"
            >
              Jetzt kostenlos starten
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
