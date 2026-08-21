import React, { useEffect, useRef, useState } from 'react';
import { experienceConfig } from '../config';

interface AtmosphereLayerProps {
  isPlaying: boolean;
  rainEnabled: boolean;
}

export const AtmosphereLayer: React.FC<AtmosphereLayerProps> = ({
  isPlaying,
  rainEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const bgDesktop = experienceConfig.background.imageDesktop;
  const bgMobile = experienceConfig.background.imageMobile;

  // Preload and verify background image
  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);

    if (!bgDesktop && !bgMobile) {
      setImageFailed(true);
      return;
    }

    const img = new Image();
    // Preload the desktop image as primary check
    img.src = bgDesktop || bgMobile;
    img.onload = () => {
      setImageLoaded(true);
      setImageFailed(false);
    };
    img.onerror = () => {
      setImageLoaded(false);
      setImageFailed(true);
    };
  }, [bgDesktop, bgMobile]);


  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Primary Scene Canvas Artwork / Image */}
      {imageLoaded && (bgDesktop || bgMobile) ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <picture>
            <source media="(max-width: 768px)" srcSet={bgMobile} />
            <img
              src={bgDesktop}
              alt="Rakesh Sanwariya Collection Scene"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover [object-position:50%_12%] md:[object-position:center_center] transition-transform duration-1000 ease-out"
              style={{
                transform: isPlaying ? 'scale(1.02)' : 'scale(1.0)',
                filter: 'contrast(1.05) brightness(0.96)',
              }}
            />
          </picture>
        </div>
      ) : (
        /* Render fallback cinematic atmospheric scene if direct image is still loading or unavailable */
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            transform: isPlaying ? 'scale(1.015)' : 'scale(1.0)',
            filter: 'contrast(1.04) brightness(0.98)',
          }}
        >
          <FallbackSceneSvg isPlaying={isPlaying} />
        </div>
      )}

      {/* 2. Incandescent Tungsten Shop Glow & Warm Sunset Ambient Light */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          isPlaying ? 'opacity-85' : 'opacity-70'
        }`}
        style={{
          background: `
            radial-gradient(ellipse 45% 35% at 72% 35%, rgba(251, 191, 36, 0.22) 0%, rgba(217, 119, 6, 0.08) 55%, transparent 80%),
            radial-gradient(ellipse 55% 45% at 18% 30%, rgba(234, 88, 12, 0.18) 0%, rgba(180, 83, 9, 0.06) 60%, transparent 85%),
            radial-gradient(ellipse 50% 30% at 20% 85%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)
          `,
        }}
      />

      {/* Rain Canvas Layer Removed */}

      {/* 4. Film Grain & Atmospheric Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px 30px rgba(10, 6, 4, 0.75), inset 0 -60px 100px 40px rgba(10, 6, 4, 0.9)',
        }}
      />

      {/* Subtle Dust & Smoke Motes at Tungsten Bulb */}
      <div className="absolute top-[28%] right-[28%] w-32 h-32 rounded-full bg-amber-400/10 blur-2xl animate-pulse pointer-events-none" />
    </div>
  );
};

// Fallback high-fidelity SVG illustration matching the Rakesh Samariya Collection dusk shop
const FallbackSceneSvg: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <svg
      className="absolute inset-0 w-full h-full object-cover opacity-95"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky Dusk Gradient */}
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a140d" />
          <stop offset="35%" stopColor="#8a280e" />
          <stop offset="65%" stopColor="#d95414" />
          <stop offset="90%" stopColor="#f39c12" />
          <stop offset="100%" stopColor="#2b1b15" />
        </linearGradient>

        {/* Sunset Clouds Texture */}
        <radialGradient id="cloudGlow" cx="20%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f39c12" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#d35400" stopOpacity="0.7" />
          <stop offset="80%" stopColor="#6e220e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Shop Lamp Tungsten Glow */}
        <radialGradient id="lampTungsten" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="65%" stopColor="#d97706" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Wet Street Reflection */}
        <linearGradient id="wetStreetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#140f0c" />
          <stop offset="25%" stopColor="#c25e0a" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#78350f" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#120c09" />
        </linearGradient>
      </defs>

      {/* Sky & Sunset Clouds */}
      <rect width="1920" height="1080" fill="url(#skyGrad)" />
      <rect width="1920" height="700" fill="url(#cloudGlow)" />

      {/* Cloud Billows in the dusk sky */}
      <g fill="#4a180d" opacity="0.65">
        <circle cx="120" cy="180" r="140" />
        <circle cx="280" cy="150" r="180" />
        <circle cx="450" cy="200" r="130" />
        <circle cx="620" cy="140" r="160" />
        <circle cx="340" cy="90" r="110" />
      </g>
      <g fill="#e65100" opacity="0.45">
        <circle cx="240" cy="240" r="120" />
        <circle cx="420" cy="280" r="90" />
        <circle cx="160" cy="300" r="80" />
      </g>

      {/* Distant Street, Street Lamps & Electric Pole */}
      <line x1="320" y1="210" x2="320" y2="720" stroke="#1c120c" strokeWidth="8" />
      <line x1="280" y1="240" x2="360" y2="240" stroke="#1c120c" strokeWidth="5" />
      <line x1="260" y1="300" x2="380" y2="300" stroke="#1c120c" strokeWidth="5" />
      {/* Electric Wires */}
      <path d="M-100,220 Q 320,380 750,260" fill="none" stroke="#120a06" strokeWidth="2.5" opacity="0.8" />
      <path d="M-100,280 Q 320,440 750,310" fill="none" stroke="#120a06" strokeWidth="2" opacity="0.7" />

      {/* Distant Shop Signboard "श्री सांवरिया कलेक्शन" */}
      <rect x="20" y="480" width="310" height="75" fill="#2d1c15" stroke="#45271a" strokeWidth="3" rx="4" />
      <text x="175" y="525" fill="#fbbf24" fontFamily="'Yatra One', 'Rozha One', serif" fontSize="22" textAnchor="middle">श्री सांवरिया कलेक्शन</text>
      <text x="175" y="545" fill="#f59e0b" fontFamily="sans-serif" fontSize="10" textAnchor="middle" opacity="0.8">रेडीमेड जीन्स · शर्ट्स · टीशर्ट</text>
      {/* Distant Shutter */}
      <rect x="30" y="565" width="290" height="150" fill="#1b120d" stroke="#2a1a13" strokeWidth="2" />

      {/* Wet Street Ground */}
      <rect x="0" y="680" width="1920" height="400" fill="#140e0b" />
      {/* Golden Wet Street Sunset Reflection */}
      <polygon points="0,700 480,720 380,1080 0,1080" fill="url(#wetStreetGrad)" opacity="0.9" />
      <path d="M 50,780 Q 180,790 320,830 Q 150,920 40,980 Z" fill="#f59e0b" opacity="0.3" filter="blur(8px)" />

      {/* Pavement Standee Board: RAKESH SANWARIYA COLLECTION */}
      <polygon points="360,640 570,640 595,960 330,960" fill="#2b1d16" stroke="#4a3022" strokeWidth="4" />
      <rect x="375" y="660" width="175" height="270" fill="#1e140f" stroke="#8a532d" strokeWidth="2" rx="3" />
      <text x="462" y="720" fill="#fcd34d" fontFamily="'Cinzel', serif" fontWeight="bold" fontSize="20" textAnchor="middle">RAKESH</text>
      <text x="462" y="748" fill="#fcd34d" fontFamily="'Cinzel', serif" fontWeight="bold" fontSize="17" textAnchor="middle">SANWARIYA</text>
      <text x="462" y="775" fill="#fbbf24" fontFamily="'Cinzel', serif" fontSize="13" letterSpacing="3" textAnchor="middle">COLLECTION</text>
      <line x1="400" y1="795" x2="525" y2="795" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="462" y="830" fill="#fed7aa" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="bold" fontSize="13" letterSpacing="1" textAnchor="middle">MENS WEAR</text>
      <text x="462" y="855" fill="#fb923c" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" letterSpacing="2" textAnchor="middle">PREMIUM QUALITY</text>

      {/* Main Shop Building Structure */}
      {/* Upper wall */}
      <rect x="680" y="80" width="1240" height="280" fill="#382419" />
      {/* Main Grand Signboard: RAKESH SANWARIYA COLLECTION */}
      <rect x="880" y="90" width="820" height="95" fill="#fef3c7" stroke="#b45309" strokeWidth="5" rx="6" />
      <rect x="886" y="96" width="808" height="83" fill="#ffedd5" stroke="#d97706" strokeWidth="2" />
      <text x="1290" y="145" fill="#78350f" fontFamily="'Cinzel', 'Yatra One', serif" fontWeight="900" fontSize="38" letterSpacing="2" textAnchor="middle">RAKESH SANWARIYA</text>
      <text x="1290" y="170" fill="#b45309" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="bold" fontSize="15" letterSpacing="7" textAnchor="middle">COLLECTION</text>

      {/* Shop Awning Canopy */}
      <polygon points="650,220 1920,220 1920,300 620,300" fill="#2d1b12" stroke="#452718" strokeWidth="4" />
      <line x1="620" y1="300" x2="1920" y2="300" stroke="#eab308" strokeWidth="3" opacity="0.6" />

      {/* Glowing Hanging Filament Tungsten Lamps under Awning */}
      <g>
        <circle cx="1020" cy="330" r="90" fill="url(#lampTungsten)" />
        <circle cx="1320" cy="330" r="110" fill="url(#lampTungsten)" />
        <circle cx="1720" cy="330" r="100" fill="url(#lampTungsten)" />
        <line x1="1020" y1="290" x2="1020" y2="325" stroke="#1c120c" strokeWidth="2" />
        <circle cx="1020" cy="328" r="6" fill="#fffbeb" />
        <line x1="1320" y1="290" x2="1320" y2="325" stroke="#1c120c" strokeWidth="2" />
        <circle cx="1320" cy="328" r="8" fill="#fffbeb" />
        <line x1="1720" y1="290" x2="1720" y2="325" stroke="#1c120c" strokeWidth="2" />
        <circle cx="1720" cy="328" r="7" fill="#fffbeb" />
      </g>

      {/* Hanging Clothes on Display Hangers */}
      {/* Yellow printed shirt */}
      <path d="M 640,360 L 730,360 L 760,430 L 730,440 L 710,590 L 630,590 L 610,440 L 590,430 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
      {/* Patterned shirt */}
      <path d="M 750,360 L 860,350 L 890,440 L 850,450 L 840,660 L 740,650 L 720,440 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
      {/* Blue shirt */}
      <path d="M 960,340 L 1070,340 L 1100,430 L 1060,440 L 1050,620 L 950,620 L 930,440 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" opacity="0.9" />
      {/* Sweatshirt */}
      <path d="M 1630,350 L 1750,350 L 1780,450 L 1740,460 L 1730,680 L 1610,680 L 1590,450 Z" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />

      {/* Circular Sock / Hanger ring */}
      <ellipse cx="1240" cy="440" rx="45" ry="12" fill="none" stroke="#ef4444" strokeWidth="4" />

      {/* Wooden Counter Desk where Shopkeeper sits */}
      <rect x="1000" y="740" width="620" height="280" fill="#3b2316" stroke="#543320" strokeWidth="4" />
      <rect x="1020" y="760" width="580" height="240" fill="#29180e" stroke="#78350f" strokeWidth="2" rx="4" />
      <text x="1310" y="840" fill="#d97706" fontFamily="'Cinzel', serif" fontSize="24" fontWeight="bold" textAnchor="middle">RAKESH</text>
      <text x="1310" y="870" fill="#d97706" fontFamily="'Cinzel', serif" fontSize="20" letterSpacing="4" textAnchor="middle">SANWARIYA</text>
      <text x="1310" y="900" fill="#b45309" fontFamily="'Cinzel', serif" fontSize="13" letterSpacing="5" textAnchor="middle">COLLECTION</text>

      {/* The Shopkeeper Silhouette / Figure sitting at the desk resting head on arm */}
      <g>
        {/* Torso in dark blue casual shirt */}
        <path d="M 1120,620 Q 1200,600 1330,620 L 1380,740 L 1100,740 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        {/* Head resting on hand */}
        <circle cx="1310" cy="565" r="34" fill="#9a6245" />
        {/* Hair & beard */}
        <path d="M 1285,550 Q 1315,530 1345,550 Q 1345,580 1315,585 Z" fill="#1e130c" />
        {/* Arm propped up on the counter */}
        <path d="M 1310,590 L 1315,740 L 1280,740 Z" fill="#845138" />
      </g>

      {/* Vintage Transistor Radio with Antenna on the Desk */}
      <g className={isPlaying ? 'animate-pulse' : ''}>
        {/* Antenna */}
        <line x1="1380" y1="710" x2="1600" y2="610" stroke="#cbd5e1" strokeWidth="3" />
        <circle cx="1600" cy="610" r="4" fill="#e2e8f0" />
        {/* Radio Body */}
        <rect x="1380" y="685" width="200" height="95" rx="6" fill="#1c120c" stroke="#78350f" strokeWidth="3" />
        <rect x="1390" y="695" width="80" height="75" rx="4" fill="#0f0906" stroke="#451a03" strokeWidth="1.5" />
        {/* Speaker Grill horizontal slats */}
        <line x1="1396" y1="708" x2="1464" y2="708" stroke="#78350f" strokeWidth="2" />
        <line x1="1396" y1="720" x2="1464" y2="720" stroke="#78350f" strokeWidth="2" />
        <line x1="1396" y1="732" x2="1464" y2="732" stroke="#78350f" strokeWidth="2" />
        <line x1="1396" y1="744" x2="1464" y2="744" stroke="#78350f" strokeWidth="2" />
        <line x1="1396" y1="756" x2="1464" y2="756" stroke="#78350f" strokeWidth="2" />
        {/* Tuning Dial with Warm Amber Glow */}
        <rect x="1480" y="700" width="90" height="35" rx="3" fill="#451a03" stroke="#d97706" strokeWidth="1" />
        <line x1="1520" y1="702" x2="1520" y2="733" stroke="#ef4444" strokeWidth="2" />
        <text x="1525" y="722" fill="#fbbf24" fontFamily="'Share Tech Mono', monospace" fontSize="9">840 kHz</text>
        {/* Radio Knobs */}
        <circle cx="1498" cy="755" r="9" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <circle cx="1548" cy="755" r="9" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      </g>

      {/* Paint Buckets on Floor (Berger, Asian Paints, Prince) */}
      <g>
        {/* Berger Paint Drum */}
        <rect x="1620" y="740" width="80" height="90" rx="5" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
        <text x="1660" y="785" fill="#fff" fontFamily="sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">Prince</text>
        <rect x="1620" y="835" width="80" height="85" rx="5" fill="#1e3a8a" stroke="#172554" strokeWidth="2" />
        <text x="1660" y="875" fill="#fbbf24" fontFamily="sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">Berger</text>
      </g>

      {/* Classic Indian Moulded Plastic Chair in Bottom Right */}
      <path d="M 1720,860 Q 1820,810 1880,880 L 1890,1040 L 1840,1040 L 1835,930 L 1750,930 L 1740,1040 L 1700,1040 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="3" opacity="0.85" />
    </svg>
  );
};
