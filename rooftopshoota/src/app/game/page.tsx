import CanvasGame from '../../components/CanvasGame';
import Navigation from '../../components/Navigation';
import './game.css';

export default function GamePage() {
  return (
    <div className="game-container">
      <Navigation />
      <div className="game-header">
        <h1>Rooftop Shooters</h1>
        <p>Navigate the rooftops and take down your targets!</p>
      </div>
      <div className="game-canvas-wrapper">
        <CanvasGame />
      </div>
      <div className="game-controls">
        <div className="control-info">
          <h3>Controls</h3>
          <ul>
            <li><strong>W</strong> - Jump</li>
            <li><strong>E</strong> - Hold to aim</li>
            <li><strong>I</strong> - Jump</li>
            <li><strong>O</strong> - Hold to aim</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 