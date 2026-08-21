import { PlayerState, PlaybackState } from '../types';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export type PlayerEventCallback = (state: Partial<PlayerState>) => void;

export class YouTubePlayerManager {
  private player: any = null;
  private containerId: string;
  private playlistId: string;
  private onStateUpdate: PlayerEventCallback;
  private timeUpdateInterval: number | null = null;
  private isDestroyed = false;
  private lastKnownVideoId = '';

  constructor(
    containerId: string,
    initialPlaylistId: string,
    onStateUpdate: PlayerEventCallback
  ) {
    this.containerId = containerId;
    this.playlistId = initialPlaylistId;
    this.onStateUpdate = onStateUpdate;
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    const startPlayer = () => {
      if (!this.player) {
        this.createPlayer();
      }
    };

    if (window.YT && window.YT.Player) {
      startPlayer();
    } else if (window.YT && typeof window.YT.ready === 'function') {
      window.YT.ready(startPlayer);
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        startPlayer();
      };
      
      let attempts = 0;
      const interval = setInterval(() => {
        if (this.isDestroyed) {
          clearInterval(interval);
          return;
        }
        attempts++;
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          startPlayer();
        }
        if (attempts > 40) {
          clearInterval(interval);
          if (!this.player) {
            this.onStateUpdate({
              error: "YouTube Player API initialization timeout.",
            });
          }
        }
      }, 200);
    }
  }

  private createPlayer() {
    if (this.isDestroyed || !document.getElementById(this.containerId)) return;

    try {
      const parsed = this.extractId(this.playlistId);
      const isVideo = parsed.type === 'video';

      const playerConfig: any = {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => this.handleReady(event),
          onStateChange: (event: any) => this.handleStateChange(event),
          onError: (event: any) => this.handleError(event),
        },
      };

      if (isVideo) {
        playerConfig.videoId = parsed.id;
      } else {
        playerConfig.playerVars.listType = 'playlist';
        playerConfig.playerVars.list = parsed.id;
      }

      this.player = new window.YT.Player(this.containerId, playerConfig);
    } catch (err: any) {
      console.warn("YouTube player instantiation error:", err);
      this.onStateUpdate({
        error: "Could not initialize YouTube Player. Please try again.",
      });
    }
  }

  private extractId(input: string): { type: 'playlist' | 'video'; id: string } {
    const trimmed = input.trim();
    if (trimmed.includes('list=')) {
      const match = trimmed.match(/list=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return { type: 'playlist', id: match[1] };
    }
    if (trimmed.includes('v=')) {
      const match = trimmed.match(/v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return { type: 'video', id: match[1] };
    }
    if (trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return { type: 'video', id: match[1] };
    }
    if (trimmed.length === 11 && !trimmed.startsWith('PL')) {
      return { type: 'video', id: trimmed };
    }
    return { type: 'playlist', id: trimmed };
  }

  private handleReady(event: any) {
    if (this.isDestroyed) return;

    try {
      if (event.target.setVolume) event.target.setVolume(80);
      if (event.target.unMute) event.target.unMute();
    } catch {
      // ignore
    }

    const playlist = this.getPlaylist();
    const videoData = this.getVideoData();

    this.onStateUpdate({
      isReady: true,
      playlistLoaded: playlist.length > 0,
      playlist,
      currentVideoId: videoData?.video_id || '',
      currentTitle: videoData?.title || 'शाम के नग़मे (Evening Radio)',
      currentArtist: videoData?.author || 'Vintage Transistor Radio',
      volume: 80,
      isMuted: false,
      duration: event.target.getDuration ? event.target.getDuration() : 0,
      error: null,
    });

    this.startTimeUpdater();
  }

  private mapYTState(ytState: number): PlaybackState {
    if (!window.YT) return 'UNSTARTED';
    switch (ytState) {
      case window.YT.PlayerState.ENDED:
        return 'ENDED';
      case window.YT.PlayerState.PLAYING:
        return 'PLAYING';
      case window.YT.PlayerState.PAUSED:
        return 'PAUSED';
      case window.YT.PlayerState.BUFFERING:
        return 'BUFFERING';
      case window.YT.PlayerState.CUED:
        return 'CUED';
      default:
        return 'UNSTARTED';
    }
  }

  private handleStateChange(event: any) {
    if (this.isDestroyed) return;
    const stateCode = event.data;
    const playbackState = this.mapYTState(stateCode);
    const isPlaying = playbackState === 'PLAYING';

    const videoData = this.getVideoData();
    const playlist = this.getPlaylist();
    const currentIndex = this.getPlaylistIndex();
    const duration = this.getDuration();
    const currentTime = this.getCurrentTime();

    const videoId = videoData?.video_id || '';
    if (videoId && videoId !== this.lastKnownVideoId) {
      this.lastKnownVideoId = videoId;
    }

    this.onStateUpdate({
      isPlaying,
      playbackState,
      currentTrackIndex: currentIndex >= 0 ? currentIndex : 0,
      currentVideoId: videoId,
      currentTitle: videoData?.title || (isPlaying ? 'Playing Melody' : 'Vintage Radio Melody'),
      currentArtist: videoData?.author || 'Rakesh Sanwariya Collection',
      duration: duration || 0,
      currentTime: currentTime || 0,
      playlist: playlist.length > 0 ? playlist : [],
    });
  }

  private handleError(event: any) {
    const errorCodes: Record<number, string> = {
      2: "Invalid playlist or video ID parameters.",
      5: "HTML5 player playback error.",
      100: "Requested track could not be found or was removed.",
      101: "The owner does not allow embedded playback. Skipping to next track...",
      150: "The owner does not allow embedded playback. Skipping to next track...",
    };

    const errMsg = errorCodes[event.data] || `Playback issue (code ${event.data}).`;
    console.warn("YouTube player error:", event.data, errMsg);

    if (event.data === 101 || event.data === 150 || event.data === 100) {
      setTimeout(() => {
        this.next();
      }, 1000);
    }

    this.onStateUpdate({
      error: errMsg,
    });
  }

  private startTimeUpdater() {
    if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval);

    this.timeUpdateInterval = window.setInterval(() => {
      if (this.isDestroyed || !this.player || typeof this.player.getCurrentTime !== 'function') {
        return;
      }
      try {
        const currentTime = this.player.getCurrentTime() || 0;
        const duration = this.player.getDuration() || 0;
        const videoData = this.getVideoData();
        const currentIndex = this.getPlaylistIndex();

        this.onStateUpdate({
          currentTime,
          duration,
          currentTrackIndex: currentIndex >= 0 ? currentIndex : 0,
          currentTitle: videoData?.title || undefined,
          currentArtist: videoData?.author || undefined,
        });
      } catch {
        // Player re-buffering
      }
    }, 500);
  }

  // --- Public Control APIs ---

  public play() {
    try {
      if (this.player) {
        if (typeof this.player.unMute === 'function') {
          this.player.unMute();
        }
        if (typeof this.player.playVideo === 'function') {
          this.player.playVideo();
        }
      }
    } catch (err) {
      console.warn("Play error", err);
    }
  }

  public pause() {
    try {
      if (this.player && typeof this.player.pauseVideo === 'function') {
        this.player.pauseVideo();
      }
    } catch (err) {
      console.warn("Pause error", err);
    }
  }

  public togglePlay(isPlaying: boolean) {
    if (isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public next() {
    try {
      if (this.player && typeof this.player.nextVideo === 'function') {
        this.player.nextVideo();
      }
    } catch (err) {
      console.warn("Next error", err);
    }
  }

  public previous() {
    try {
      if (this.player && typeof this.player.previousVideo === 'function') {
        const curr = this.getCurrentTime();
        if (curr > 3) {
          this.seekTo(0);
        } else {
          this.player.previousVideo();
        }
      }
    } catch (err) {
      console.warn("Previous error", err);
    }
  }

  public playVideoAt(index: number) {
    try {
      if (this.player && typeof this.player.playVideoAt === 'function') {
        this.player.playVideoAt(index);
      }
    } catch (err) {
      console.warn("playVideoAt error", err);
    }
  }

  public seekTo(seconds: number) {
    try {
      if (this.player && typeof this.player.seekTo === 'function') {
        this.player.seekTo(seconds, true);
        this.onStateUpdate({ currentTime: seconds });
      }
    } catch (err) {
      console.warn("Seek error", err);
    }
  }

  public setVolume(volume: number) {
    try {
      const vol = Math.max(0, Math.min(100, volume));
      if (this.player && typeof this.player.setVolume === 'function') {
        this.player.setVolume(vol);
        this.onStateUpdate({ volume: vol, isMuted: vol === 0 });
      }
    } catch (err) {
      console.warn("Volume error", err);
    }
  }

  public toggleMute(isMuted: boolean) {
    try {
      if (this.player) {
        if (isMuted && typeof this.player.unMute === 'function') {
          this.player.unMute();
          this.onStateUpdate({ isMuted: false });
        } else if (!isMuted && typeof this.player.mute === 'function') {
          this.player.mute();
          this.onStateUpdate({ isMuted: true });
        }
      }
    } catch (err) {
      console.warn("Mute error", err);
    }
  }

  public loadNewPlaylist(input: string) {
    const parsed = this.extractId(input);
    this.playlistId = parsed.id;
    try {
      if (this.player) {
        if (parsed.type === 'video' && typeof this.player.loadVideoById === 'function') {
          this.player.loadVideoById(parsed.id);
        } else if (typeof this.player.loadPlaylist === 'function') {
          this.player.loadPlaylist({
            list: parsed.id,
            listType: 'playlist',
          });
        }
      }
    } catch (err) {
      console.warn("Load playlist error", err);
    }
  }

  // --- Utility Getters ---

  public getCurrentTime(): number {
    try {
      return (this.player && typeof this.player.getCurrentTime === 'function')
        ? this.player.getCurrentTime()
        : 0;
    } catch {
      return 0;
    }
  }

  public getDuration(): number {
    try {
      return (this.player && typeof this.player.getDuration === 'function')
        ? this.player.getDuration()
        : 0;
    } catch {
      return 0;
    }
  }

  public getVideoData(): { title?: string; author?: string; video_id?: string } | null {
    try {
      if (this.player && typeof this.player.getVideoData === 'function') {
        return this.player.getVideoData();
      }
    } catch {
      return null;
    }
    return null;
  }

  public getPlaylist(): string[] {
    try {
      if (this.player && typeof this.player.getPlaylist === 'function') {
        const list = this.player.getPlaylist();
        return Array.isArray(list) ? list : [];
      }
    } catch {
      return [];
    }
    return [];
  }

  public getPlaylistIndex(): number {
    try {
      if (this.player && typeof this.player.getPlaylistIndex === 'function') {
        return this.player.getPlaylistIndex();
      }
    } catch {
      return 0;
    }
    return 0;
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
    try {
      if (this.player && typeof this.player.destroy === 'function') {
        this.player.destroy();
      }
    } catch {
      // ignore
    }
    this.player = null;
  }
}
