import { Volume2, VolumeX } from "lucide-react";
import classes from "./MatchViewportV2.module.css";

import {
  DEFAULT_SIMULATOR_SETTINGS,
  clampSoundVolume,
  useSimulatorSettings,
} from "../../../../simulator/settings";
import { useBackgroundMusic } from "../../audio/BackgroundMusic";

/** Remembers the SFX volume from before a mute so unmute restores the player's choice. */
const VOLUME_BEFORE_MUTE_KEY = "tcg:cyberpunk:sfx-volume-before-mute:v1";
/** Remembers the music mute preference from before a board mute so unmute
 * restores it instead of force-enabling music the player had muted. */
const MUSIC_MUTED_BEFORE_MUTE_KEY = "tcg:cyberpunk:music-muted-before-mute:v1";

function readVolumeBeforeMute(): number {
  try {
    const raw = localStorage.getItem(VOLUME_BEFORE_MUTE_KEY);
    // Number(null) is 0 — only parse an actually stored value.
    if (raw !== null && raw !== "") {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        return clampSoundVolume(parsed);
      }
    }
  } catch {
    // Storage may be blocked; fall back to the default volume.
  }
  return DEFAULT_SIMULATOR_SETTINGS.soundVolume;
}

function readMusicMutedBeforeMute(): boolean | null {
  try {
    const raw = localStorage.getItem(MUSIC_MUTED_BEFORE_MUTE_KEY);
    if (raw === "true") return true;
    if (raw === "false") return false;
  } catch {
    // Storage may be blocked; unmute then falls back to unmuting music.
  }
  return null;
}

function storeMuteSnapshot(soundVolume: number, musicMuted: boolean | undefined): void {
  try {
    localStorage.setItem(VOLUME_BEFORE_MUTE_KEY, String(soundVolume));
    localStorage.setItem(MUSIC_MUTED_BEFORE_MUTE_KEY, String(musicMuted === true));
  } catch {
    // Ignore; unmute then restores the default volume / unmutes music.
  }
}

function clearMuteSnapshot(): void {
  try {
    localStorage.removeItem(VOLUME_BEFORE_MUTE_KEY);
    localStorage.removeItem(MUSIC_MUTED_BEFORE_MUTE_KEY);
  } catch {
    // Ignore; the next mute simply stores the current state again.
  }
}

/**
 * One board-cluster switch for every sound: it zeroes the SFX volume and
 * mutes the background music together. The muted readout tracks BOTH
 * channels — SFX alone would report "muted" while music keeps playing, and
 * clicking that button would raise SFX instead of silencing what's audible.
 * Unmute restores each channel's pre-toggle state independently, so music
 * the player muted in the settings sheet stays muted.
 */
export function SoundMuteShortcut() {
  const { settings, setSoundVolume } = useSimulatorSettings();
  const music = useBackgroundMusic();
  const musicMuted = music?.state.muted ?? false;
  const muted = settings.soundVolume === 0 || musicMuted;

  const toggleMute = () => {
    if (muted) {
      // SFX: only un-silence when the toggle actually zeroed it — a click that
      // only unmutes music must not clobber the player's SFX volume. With no
      // stored pre-mute volume (blocked storage), fall back to the default
      // instead of staying silent.
      if (settings.soundVolume === 0) {
        setSoundVolume(readVolumeBeforeMute());
      }
      // Music: go back to the stored pre-toggle preference rather than always
      // force-enabling, so music muted independently in the settings sheet
      // stays muted.
      music?.player?.setMuted(readMusicMutedBeforeMute() ?? false);
      clearMuteSnapshot();
      return;
    }
    storeMuteSnapshot(settings.soundVolume, musicMuted);
    setSoundVolume(0);
    music?.player?.setMuted(true);
  };

  return (
    <button
      type="button"
      className={classes.undo}
      data-active={muted || undefined}
      aria-pressed={muted}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      onClick={toggleMute}
    >
      {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
    </button>
  );
}
