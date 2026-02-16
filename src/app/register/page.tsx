import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kostenlos registrieren
          </h1>
          <p className="text-gray-600">
            Starte jetzt mit dem Outbound Sales Trainer
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Max Mustermann"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="max@beispiel.de"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Passwort
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            Jetzt registrieren
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Bereits registriert?{" "}
          <Link href="/login" className="text-purple-600 hover:underline">
            Jetzt anmelden
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          Mit der Registrierung akzeptierst du unsere{" "}
          <Link href="/datenschutz" className="underline">
            Datenschutzerklärung
          </Link>
        </div>
      </div>
    </div>
  );
}
