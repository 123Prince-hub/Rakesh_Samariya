export interface TrackMetadata {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  thumbnail?: string;
  duration?: number;
}

export interface PlaylistPreset {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  playlistId: string;
  moodTag: string;
  coverImage?: string;
}

export interface ExperienceConfig {
  site: {
    title: string;
    hindiTitle: string;
    subtitle: string;
    description: string;
    shopSignText: string;
    locationText: string;
  };
  background: {
    imageDesktop: string;
    imageMobile: string;
    positionDesktop: string;
    positionMobile: string;
    overlayOpacity: number;
    amberGlowIntensity: number;
  };
  theme: {
    accent: string;
    accentSecondary: string;
    amberTungsten: string;
    darkSurface: string;
    textPrimary: string;
    textMuted: string;
  };
  music: {
    defaultPlaylistId: string;
    playlists: PlaylistPreset[];
    metadata: Record<string, TrackMetadata>;
  };
  effects: {
    grain: boolean;
    vignette: boolean;
    rainParticles: boolean;
    ambientGlow: boolean;
    lampFlicker: boolean;
    parallax: boolean;
  };
  ui: {
    defaultPlayerMode: 'transistor' | 'minimal';
    showPlaylist: boolean;
    showVolume: boolean;
    showShare: boolean;
    showKeyboardHints: boolean;
    showAmbientRain: boolean;
  };
}

export type PlaybackState = 'UNSTARTED' | 'ENDED' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'CUED';

export interface PlayerState {
  isReady: boolean;
  isPlaying: boolean;
  playbackState: PlaybackState;
  currentTrackIndex: number;
  currentVideoId: string;
  currentTitle: string;
  currentArtist: string;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playlist: string[];
  playlistTitles: string[];
  playlistLoaded: boolean;
  error: string | null;
}
