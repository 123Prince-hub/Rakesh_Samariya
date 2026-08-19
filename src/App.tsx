import React, { useState, useEffect, useRef, useCallback } from 'react';
import { experienceConfig } from './config';
import { PlayerState, PlaylistPreset } from './types';
import { YouTubePlayerManager } from './services/youtube';
import { ambientEngine } from './services/ambientAudio';
import { AtmosphereLayer } from './components/AtmosphereLayer';
import { TransistorRadioPlayer } from './components/TransistorRadioPlayer';
import { PlaylistDrawer } from './components/PlaylistDrawer';
import { HiddenYouTubePlayer } from './components/HiddenYouTubePlayer';
import { Radio } from 'lucide-react';

const YT_CONTAINER_ID = 'yt-embedded-player-container';

export default function App() {
  // Application State
  const [playerState, setPlayerState] = useState<PlayerState>({
    isReady: false,
    isPlaying: false,
    playbackState: 'UNSTARTED',
    currentTrackIndex: 0,
    currentVideoId: '',
    currentTitle: 'शाम के नग़मे (Evening Radio Melodies)',
    currentArtist: 'Transistor Radio MW 840 kHz',
    currentTime: 0,
    duration: 0,
    volume: 80,
    isMuted: false,
    playlist: [],
    playlistTitles: [],
    playlistLoaded: false,
    error: null,
  });

  const [activePlaylistId, setActivePlaylistId] = useState<string>(
    experienceConfig.music.defaultPlaylistId
  );
  const [activePresetName, setActivePresetName] = useState<string>(
    experienceConfig.music.playlists[0]?.name || 'Monsoon Dusk'
  );

  // UI Modals & Panels
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [rainAudioEnabled, setRainAudioEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const playerManagerRef = useRef<YouTubePlayerManager | null>(null);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  // Initialize YouTube Player
  useEffect(() => {
    const manager = new YouTubePlayerManager(
      YT_CONTAINER_ID,
      activePlaylistId,
      (partialState) => {
        setPlayerState((prev) => ({
          ...prev,
          ...partialState,
        }));
      }
    );

    playerManagerRef.current = manager;

    // Gracefully fade out loading screen once player manager is initialized
    const timer = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      manager.destroy();
    };
  }, []);

  // Sync ambient rain engine with user toggle
  useEffect(() => {
    if (rainAudioEnabled && playerState.isPlaying) {
      ambientEngine.start();
    } else if (!rainAudioEnabled) {
      ambientEngine.stop();
    }
  }, [rainAudioEnabled, playerState.isPlaying]);

  // Player Control Handlers
  const handlePlay = useCallback(() => {
    if (rainAudioEnabled && !ambientEngine.isEnabled()) {
      ambientEngine.start();
    }
    playerManagerRef.current?.play();
  }, [rainAudioEnabled]);

  const handlePause = useCallback(() => {
    playerManagerRef.current?.pause();
  }, []);

  const handleNext = useCallback(() => {
    ambientEngine.triggerTuningSwoosh();
    playerManagerRef.current?.next();
    showToast('ट्यूनिंग अगला गीत... (Tuning next melody)');
  }, [showToast]);

  const handlePrevious = useCallback(() => {
    ambientEngine.triggerTuningSwoosh();
    playerManagerRef.current?.previous();
    showToast('ट्यूनिंग पिछला गीत... (Tuning previous melody)');
  }, [showToast]);

  const handleSeek = useCallback((seconds: number) => {
    playerManagerRef.current?.seekTo(seconds);
  }, []);

  const handleVolumeChange = useCallback((vol: number) => {
    playerManagerRef.current?.setVolume(vol);
  }, []);

  const handleToggleMute = useCallback(() => {
    playerManagerRef.current?.toggleMute(playerState.isMuted);
  }, [playerState.isMuted]);

  const handleSelectTrack = useCallback((index: number) => {
    ambientEngine.triggerTuningSwoosh();
    playerManagerRef.current?.playVideoAt(index);
    showToast(`गीत #${index + 1} पर ट्यून किया गया`);
  }, [showToast]);

  const handleSelectPreset = useCallback((preset: PlaylistPreset) => {
    ambientEngine.triggerTuningSwoosh();
    setActivePlaylistId(preset.playlistId);
    setActivePresetName(preset.name);
    playerManagerRef.current?.loadNewPlaylist(preset.playlistId);
    showToast(`स्टेशन बदला गया: ${preset.hindiName}`);
  }, [showToast]);

  const handleLoadCustomPlaylist = useCallback((newPlaylistId: string) => {
    ambientEngine.triggerTuningSwoosh();
    setActivePlaylistId(newPlaylistId);
    setActivePresetName('Custom Playlist');
    playerManagerRef.current?.loadNewPlaylist(newPlaylistId);
    showToast('कस्टम YouTube प्लेलिस्ट लोड की गई');
  }, [showToast]);
 
  const handleTuneStation = useCallback((freq: number) => {
    ambientEngine.triggerTuningSwoosh();
  }, []);

  const handleToggleRain = useCallback(() => {
    setRainAudioEnabled((prev) => {
      const next = !prev;
      if (next) {
        ambientEngine.start();
        showToast('बारिश और वातावरण ध्वनि चालू (Rain Ambience ON)');
      } else {
        ambientEngine.stop();
        showToast('बारिश ध्वनि बंद (Rain Ambience OFF)');
      }
      return next;
    });
  }, [showToast]);

  return (
    <main className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#0e0a07] text-[#fef3c7] flex flex-col justify-between select-none">
      {/* 1. Atmospheric Scene Layer (Background Image, Rain Particles, Lamp Glow) */}
      <AtmosphereLayer
        isPlaying={playerState.isPlaying}
        rainEnabled={rainAudioEnabled}
      />

      {/* 3. Center Atmospheric Title / Identity Overlay */}
      <section className="relative z-10 w-full px-3 sm:px-8 text-center pointer-events-none my-auto transition-opacity duration-700">
        <div className="max-w-3xl mx-auto space-y-1 sm:space-y-1.5">
          <h1 className="font-devanagari text-5xl sm:text-6xl md:text-7xl text-[#fffbeb] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] tracking-wide font-black">
            राकेश <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]">सामरिया</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/60 font-mono tracking-widest uppercase mt-4 opacity-80">
            Crafted with <span className="text-amber-500/80">❤</span> by <span className="font-bold text-amber-100/80">Prince Kirad</span>
          </p>
        </div>
      </section>

      {/* 4. Bottom Music Player Console (Vintage Transistor Radio or Compact HUD) */}
      <section className="relative z-20 w-full px-2 sm:px-6 mb-4 sm:mb-6 pointer-events-auto">
        <TransistorRadioPlayer
          playerState={playerState}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onTogglePlaylist={() => setIsPlaylistOpen(true)}
          onToggleRain={handleToggleRain}
          rainEnabled={rainAudioEnabled}
          onTuneStation={handleTuneStation}
        />
      </section>

      {/* 5. Hidden Official YouTube IFrame Player Container */}
      <HiddenYouTubePlayer containerId={YT_CONTAINER_ID} />

      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        playerState={playerState}
        activePlaylistId={activePlaylistId}
        onSelectPreset={handleSelectPreset}
        onSelectTrack={handleSelectTrack}
        onLoadCustomPlaylist={handleLoadCustomPlaylist}
      />

      {/* 9. Floating Radio Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/90 border border-amber-500/50 text-amber-300 text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 10. Startup Cinematic Loading Screen */}
      {isLoadingScreen && (
        <div className="fixed inset-0 z-50 bg-[#0e0a07] flex flex-col items-center justify-center p-6 text-center transition-opacity duration-700">
          <div className="space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto animate-pulse">
              <Radio className="w-8 h-8 text-amber-400" />
            </div>

            <h2 className="font-devanagari text-2xl sm:text-3xl text-amber-100 font-bold">
              कहानी शुरू हो रही है...
            </h2>

            <p className="text-xs text-amber-300/70 font-mono">
              दुकान के पुराने रेडियो पर धुनें बजने को तैयार हैं
            </p>

            <div className="w-48 h-1 bg-stone-900 rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 animate-[pulse_1s_infinite]" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
