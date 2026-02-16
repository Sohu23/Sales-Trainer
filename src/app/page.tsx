import Link from "next/link";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Outbound Sales Trainer</span>
          </div>
          <nav className="nav">
            <Link href="/login" className="nav-link">
              Anmelden
            </Link>
            <Link href="/register" className="btn btn-primary">
              Kostenlos starten
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Verkaufen lernen.
              <br />
              <span className="highlight">Mit KI.</span>
            </h1>
            <p className="hero-description">
              Der intelligente Trainingspartner für dein Outbound-Sales-Team.
              Realistische Rollenspiele, personalisiertes Feedback, messbare
              Erfolge.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-large">
                Jetzt kostenlos testen
              </Link>
              <Link href="/demo" className="btn btn-secondary btn-large">
                Demo ansehen
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-icon">📞</div>
              <h3 className="visual-title">AI-gestütztes Training</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Warum Outbound Sales Trainer?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎭</div>
            <h3 className="feature-title">Realistische Rollenspiele</h3>
            <p className="feature-description">
              Simuliere echte Verkaufsgespräche mit KI-gesteuerten Personas.
              Übe Einwandbehandlung, Pitches und Abschlüsse in sicherer
              Umgebung.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Personalisiertes Feedback</h3>
            <p className="feature-description">
              Erhalte detailliertes, KI-generiertes Feedback zu Gesprächsführung,
              Tonalität, Einwandbehandlung und Abschlusstechniken.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Messbare Erfolge</h3>
            <p className="feature-description">
              Verfolge den Fortschritt deines Teams mit detaillierten Analytics.
              Identifiziere Stärken und Schwächen auf einen Blick.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Jederzeit verfügbar</h3>
            <p className="feature-description">
              Trainiere wann und wo du willst. Keine Terminabsprachen, keine
              Wartezeiten. Sofortiges Feedback, 24/7.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Branchen-spezifisch</h3>
            <p className="feature-description">
              Trainingsszenarien angepasst an deine Branche, Produkte und
              Zielgruppe. Von SaaS über Pharma bis Industrie.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Team-Management</h3>
            <p className="feature-description">
              Verwalte dein Sales-Team zentral. Weise Trainings zu, tracke
              Fortschritte und analysiere Performance-Daten.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Bereit, dein Sales-Team zu stärken?</h2>
          <p className="cta-description">
            Starte jetzt kostenlos mit dem Outbound Sales Trainer
          </p>
          <Link href="/register" className="btn btn-primary btn-large">
            Kostenlos starten
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
          <p className="footer-copyright">
            © 2026 Outbound Sales Trainer. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}
