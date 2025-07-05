'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="logo-text">Rooftop</span>
          <span className="logo-accent">Shooters</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            href="/" 
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/game" 
            className={`nav-link ${pathname === '/game' ? 'active' : ''}`}
          >
            Play Game
          </Link>
        </div>
      </div>
    </nav>
  );
} 