import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <Link
          href="/"
          className="text-purple-600 hover:underline mb-6 inline-block"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Datenschutzerklärung
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Verantwortliche Stelle
            </h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="font-medium">
              Outbound Sales Trainer
              <br />
              Sören Hüttemann
              <br />
              E-Mail: soeren@ai-teams.de
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Erhebung und Speicherung personenbezogener Daten
            </h2>
            <p>
              Beim Besuch unserer Website werden automatisch Informationen
              allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles)
              beinhalten etwa die Art des Webbrowsers, das verwendete
              Betriebssystem, den Domainnamen Ihres Internet Service Providers
              und Ähnliches.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Cookies
            </h2>
            <p>
              Unsere Website verwendet Cookies. Das sind kleine Textdateien, die
              es möglich machen, auf dem Endgerät des Nutzers spezifische, auf
              den Nutzer bezogene Informationen zu speichern.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. Ihre Rechte
            </h2>
            <p>Sie haben das Recht:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Auskunft über Ihre gespeicherten Daten zu verlangen</li>
              <li>Berichtigung unrichtiger Daten zu verlangen</li>
              <li>Löschung Ihrer Daten zu verlangen</li>
              <li>
                Einschränkung der Verarbeitung Ihrer Daten zu verlangen
              </li>
              <li>Widerspruch gegen die Verarbeitung einzulegen</li>
              <li>Datenübertragbarkeit zu verlangen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              5. Kontakt
            </h2>
            <p>
              Bei Fragen zum Datenschutz wenden Sie sich bitte an:{" "}
              <a
                href="mailto:soeren@ai-teams.de"
                className="text-purple-600 hover:underline"
              >
                soeren@ai-teams.de
              </a>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            Stand: Februar 2026
          </p>
        </div>
      </div>
    </div>
  );
}
