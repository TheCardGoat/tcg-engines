import { useEffect, useRef } from "react";
import { useEngine, useUserConfig } from "../engine";
import { PLAYER_SIDE_TO_ID } from "../engine/sides";
import { scheduledSoundsForEntry } from "./event-sounds";
import { disposeSoundService, initSoundService, playSound, setSoundVolume } from "./sound-service";

export function SoundPlayer(): null {
  const { humanSide, rawEngineEvents } = useEngine();
  const { soundVolume } = useUserConfig();
  const lastProcessedIdRef = useRef<number>(0);
  const pendingTimersRef = useRef<Set<number>>(new Set());
  const viewerPlayerId = PLAYER_SIDE_TO_ID[humanSide];

  useEffect(() => {
    initSoundService();
    const timers = pendingTimersRef.current;
    return () => {
      for (const id of timers) {
        window.clearTimeout(id);
      }
      timers.clear();
      disposeSoundService();
    };
  }, []);

  useEffect(() => {
    setSoundVolume(soundVolume);
  }, [soundVolume]);

  useEffect(() => {
    const maxId = rawEngineEvents.length > 0 ? rawEngineEvents[rawEngineEvents.length - 1].id : 0;
    if (maxId < lastProcessedIdRef.current) {
      lastProcessedIdRef.current = 0;
      for (const id of pendingTimersRef.current) {
        window.clearTimeout(id);
      }
      pendingTimersRef.current.clear();
    }

    if (soundVolume === 0) {
      for (const entry of rawEngineEvents) {
        if (entry.id > lastProcessedIdRef.current) {
          lastProcessedIdRef.current = entry.id;
        }
      }
      return;
    }

    for (const entry of rawEngineEvents) {
      if (entry.id <= lastProcessedIdRef.current) {
        continue;
      }
      lastProcessedIdRef.current = entry.id;
      for (const sound of scheduledSoundsForEntry(entry, viewerPlayerId)) {
        const timerId = window.setTimeout(() => {
          pendingTimersRef.current.delete(timerId);
          playSound(sound.id);
        }, sound.startMs);
        pendingTimersRef.current.add(timerId);
      }
    }
  }, [rawEngineEvents, soundVolume, viewerPlayerId]);

  return null;
}
