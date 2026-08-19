import { ExperienceConfig } from './types';

export const experienceConfig: ExperienceConfig = {
  site: {
    title: "RAKESH SAMARIYA COLLECTION",
    hindiTitle: "राकेश सामरिया — कलेक्शन",
    subtitle: "A Nostalgic Monsoon Dusk · Vintage Radio & Soulful Melodies",
    description: "An immersive Indian music microsite set in a monsoon dusk bazaar, listening to old & new memories over a transistor radio.",
    shopSignText: "श्री सांवरिया कलेक्शन · MENS WEAR PREMIUM QUALITY",
    locationText: "बाज़ार का कोना · Rainy Dusk 19:48",
  },

  background: {
    // Default image path or high-res artwork representation
    image: "./bg.png",
    positionDesktop: "center center",
    positionMobile: "50% 15%", // Center shop signboard and text on mobile screens
    overlayOpacity: 0.25,
    amberGlowIntensity: 0.8,
  },

  theme: {
    accent: "#f59e0b", // Amber gold matching the sunset & lamps
    accentSecondary: "#ea580c", // Dusk fiery orange
    amberTungsten: "#fbbf24", // 2700K incandescent shop lamp glow
    darkSurface: "rgba(18, 12, 8, 0.85)", // Warm rich wood/night tone
    textPrimary: "#fef3c7", // Warm parchment white
    textMuted: "#a89984", // Vintage warm grey
  },

  music: {
    // The provided playlist or default curated Indian soulful / indie / lo-fi playlist
    defaultPlaylistId: "PLO6WOx_nE9ULl-FgE0NPR4c6BSu-1-CPJ",

    playlists: [
      {
        id: "monsoon-dusk",
        name: "Monsoon Dusk & Old Radio",
        hindiName: "शाम की धुनें और पुराना रेडियो",
        description: "Soulful nostalgic Hindi melodies, acoustic ghazals & indie lo-fi",
        playlistId: "PLO6WOx_nE9ULl-FgE0NPR4c6BSu-1-CPJ",
        moodTag: "मनभावन शाम",
      },
      {
        id: "nh-48-night",
        name: "Late Night NH-48 Journey",
        hindiName: "देर रात का हाइवे सफ़र",
        description: "Travel songs, synthwave Indian road trip & reflective night drives",
        playlistId: "PLgzTt0k8mXzEk586ze4Dilmk5039P95BC",
        moodTag: "सफ़रनामा",
      },
      {
        id: "bazaar-retro",
        name: "70s-90s Vintage Cassette Classics",
        hindiName: "गोल्डन एरा कैसेट क्लासिक्स",
        description: "Evergreen Kishore, Rafi, RD Burman & Gulzar masterpieces",
        playlistId: "PL9bw4sVu4Fxf4fXg7E7vYy0Gf36j2sDqR",
        moodTag: "सदाबहार नग़मे",
      },
      {
        id: "indie-chai",
        name: "Tapri Chai & Indian Indie",
        hindiName: "टपरी चाय और नया इंडी",
        description: "Prateek Kuhad, Anuv Jain, When Chai Met Toast & chill vibes",
        playlistId: "PL4fGSI1pDJn7_G_Y8sK5zUqBqG1E7nBv6",
        moodTag: "शाम की चाय",
      },
    ],

    // Metadata override map for key tracks when YouTube metadata is minimal
    metadata: {
      "default": {
        title: "शाम के नग़मे (Evening Radio Melodies)",
        artist: "Transistor Radio MW 840 kHz",
      },
      "dQw4w9WgXcQ": {
        title: "Chura Liya Hai Tumne",
        artist: "R.D. Burman, Asha Bhosle · 1973",
      },
      "hEJnMQG562U": {
        title: "Baarishein (Acoustic Monsoon)",
        artist: "Anuv Jain",
      },
      "k4V3Ui6873o": {
        title: "Kasoor (Soul Version)",
        artist: "Prateek Kuhad",
      },
    },
  },

  effects: {
    grain: true,
    vignette: true,
    rainParticles: true,
    ambientGlow: true,
    lampFlicker: true,
    parallax: true,
  },

  ui: {
    defaultPlayerMode: 'transistor',
    showPlaylist: true,
    showVolume: true,
    showShare: true,
    showKeyboardHints: true,
    showAmbientRain: true,
  },
};
