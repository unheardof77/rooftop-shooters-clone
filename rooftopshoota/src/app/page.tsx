import Link from 'next/link';
import Navigation from '../components/Navigation';
import './homepage.css';

export default function Home() {
  return (
    <div className="landing-container">
      <Navigation />
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-main">Rooftop</span>
            <span className="title-accent">Shooters</span>
          </h1>
          <p className="hero-subtitle">
            Navigate the urban landscape, take precise shots, and become the ultimate rooftop sniper
          </p>
          <div className="hero-buttons">
            <Link href="/game" className="btn btn-primary">
              Play Now
            </Link>
            <button className="btn btn-secondary">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="game-preview">
            <div className="preview-window">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="preview-content">
                <div className="preview-game-area">
                  <div className="preview-character"></div>
                  <div className="preview-targets">
                    <div className="target"></div>
                    <div className="target"></div>
                    <div className="target"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Game Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Precise Shooting</h3>
            <p>Master the art of long-range shooting with realistic physics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Urban Environment</h3>
            <p>Navigate through complex rooftop layouts and urban obstacles</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast-Paced Action</h3>
            <p>Quick reflexes and strategic thinking required</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Take the Shot?</h2>
        <p>Join thousands of players in the ultimate rooftop shooting experience</p>
        <Link href="/game" className="btn btn-primary btn-large">
          Start Playing
        </Link>
      </div>
    </div>
  );
}

