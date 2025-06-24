// pages/index.tsx
import dynamic from 'next/dynamic';
import CanvasGame from '../components/CanvasGame';

export default function Home() {
  return (
    <main>
      <h1>2D Canvas Game</h1>
      <CanvasGame />
    </main>
  );
}

