import { Button, NativeSelect, Stack, Switch, Text } from "@mantine/core";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { SimulatorVolumeControl } from "../../../simulator/participant-actions/SimulatorParticipantActions";
import {
  BackgroundMusicPlayer,
  DEFAULT_MUSIC,
  MUSIC_STORAGE_KEY,
  MUSIC_TRACKS,
  isMusicTrackId,
  readMusicPreferences,
  type MusicBackend,
  type MusicState,
} from "./background-music";
import { WebAudioMusic } from "./web-audio-music";

const MusicContext = createContext<{
  state: MusicState;
  player: BackgroundMusicPlayer | null;
} | null>(null);
const createBackend = () => new WebAudioMusic();

/** Live music access for controls outside the settings sheet, e.g. the board mute button. */
export function useBackgroundMusic() {
  return useContext(MusicContext);
}

export function BackgroundMusicProvider({
  children,
  backendFactory = createBackend,
}: {
  children: ReactNode;
  backendFactory?: () => MusicBackend;
}) {
  const [state, setState] = useState<MusicState>({
    ...DEFAULT_MUSIC,
    status: "waiting",
    playingTrackId: null,
  });
  const player = useRef<BackgroundMusicPlayer | null>(null);
  useEffect(() => {
    const instance = new BackgroundMusicPlayer(backendFactory(), readMusicPreferences(), (next) => {
      setState(next);
      try {
        localStorage.setItem(
          MUSIC_STORAGE_KEY,
          JSON.stringify({ volume: next.volume, muted: next.muted, trackId: next.trackId }),
        );
      } catch {
        // Storage may be blocked; controls still work for this session.
      }
    });
    player.current = instance;
    setState(instance.snapshot);
    const unlock = () => {
      void instance.unlock();
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      instance.dispose();
      player.current = null;
    };
  }, [backendFactory]);
  return (
    <MusicContext.Provider value={{ state, player: player.current }}>
      {children}
    </MusicContext.Provider>
  );
}

export function BackgroundMusicControls() {
  const music = useContext(MusicContext);
  // Game settings also render outside an active board, where there is no player.
  if (!music) return null;
  const { state, player } = music;
  const playingTitle = MUSIC_TRACKS.find((track) => track.id === state.playingTrackId)?.title;
  return (
    <Stack gap="xs" role="group" aria-label="Background music">
      <SimulatorVolumeControl
        label="Background music volume"
        value={state.volume}
        onChange={(value) => player?.setVolume(value)}
      />
      <Switch
        label="Mute background music"
        classNames={{
          body: "pointer-coarse:min-h-11 pointer-coarse:items-center",
          label: "pointer-coarse:min-h-11 pointer-coarse:flex pointer-coarse:items-center",
        }}
        checked={state.muted}
        onChange={(event) => player?.setMuted(event.currentTarget.checked)}
      />
      <details>
        <summary className="cursor-pointer text-sm">Music options</summary>
        <Stack gap="xs" pt="xs">
          <NativeSelect
            label="Music track"
            classNames={{ input: "pointer-coarse:min-h-11" }}
            data={MUSIC_TRACKS.map((track) => ({ value: track.id, label: track.title }))}
            value={state.trackId}
            onChange={(event) => {
              const id = event.currentTarget.value;
              if (isMusicTrackId(id)) void player?.select(id);
            }}
          />
          <Button
            className="pointer-coarse:min-h-11"
            size="compact-sm"
            variant="light"
            onClick={() => player?.next()}
          >
            Next track
          </Button>
          <Text size="xs" c="dimmed">
            Each track plays once and repeats twice before the next track starts.
          </Text>
          <Text size="xs" role="status">
            {state.status === "waiting"
              ? "Interact with the board to start music."
              : state.status === "loading"
                ? "Loading music…"
                : state.status === "error"
                  ? "Music could not load. Retry or choose another track."
                  : state.muted || state.volume === 0
                    ? "Background music muted."
                    : `Playing: ${playingTitle}`}
          </Text>
          {state.status === "error" && (
            <Button
              className="pointer-coarse:min-h-11"
              size="compact-sm"
              onClick={() => void player?.select(state.trackId)}
            >
              Retry music
            </Button>
          )}
        </Stack>
      </details>
    </Stack>
  );
}
