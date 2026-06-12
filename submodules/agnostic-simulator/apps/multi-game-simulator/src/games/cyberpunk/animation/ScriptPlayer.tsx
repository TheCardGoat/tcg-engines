import { useEffect, useLayoutEffect, useRef } from "react";
import { PLAYER_SIDE_TO_ID, useEngine, type RawEngineEventEntry, type Side } from "../engine";
import type { AnimationScript, CardDomCache, CardSnapshot } from "./types";
import { playCardLand } from "./recipes/cardLand";
import { playCombat } from "./recipes/combat";
import { playGigMove } from "./recipes/gigMove";
import { phaseChange } from "./recipes/phaseChange";
import { playResourceFloat } from "./recipes/resourceFloat";
import { isCyberpunkAnimationStepSharedSupported } from "./sharedEvents";
import { useReducedMotion } from "./useReducedMotion";
import classes from "./ScriptPlayer.module.css";

interface ScriptPlayerProps {
  /**
   * Multiplier applied to every step's startMs and durationMs. Defaults
   * to 1.0; replay viewers can pass 0.5..4.0 for variable-speed playback.
   * `prefers-reduced-motion: reduce` forces the effective multiplier to 0.
   */
  speed?: number;
}

const PLAYER_ID_TO_SIDE = new Map<string, Side>([
  [PLAYER_SIDE_TO_ID.player as unknown as string, "player"],
  [PLAYER_SIDE_TO_ID.opponent as unknown as string, "opponent"],
]);

function sideForPlayerId(playerId: string): Side | null {
  return PLAYER_ID_TO_SIDE.get(playerId) ?? null;
}

function snapshotDom(): Map<string, CardSnapshot> {
  const snap = new Map<string, CardSnapshot>();
  if (typeof document === "undefined") return snap;
  const nodes = document.querySelectorAll<HTMLElement>("[data-card-id]");
  for (const el of nodes) {
    const id = el.getAttribute("data-card-id");
    if (!id) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (snap.has(id)) continue;
    snap.set(id, { rect, outerHTML: el.outerHTML });
  }
  return snap;
}

function snapshotDiceDom(): Map<string, CardSnapshot> {
  const snap = new Map<string, CardSnapshot>();
  if (typeof document === "undefined") return snap;
  const nodes = document.querySelectorAll<HTMLElement>("[data-die-id]");
  for (const el of nodes) {
    const id = el.getAttribute("data-die-id");
    if (!id) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (snap.has(id)) continue;
    snap.set(id, { rect, outerHTML: el.outerHTML });
  }
  return snap;
}

/**
 * Listens to the engine's per-command animationScripts and drives DOM-level
 * animations that are still intentionally Cyberpunk-specific, such as card
 * landing emphasis, combat, gig movement, phase banners, and resource floats.
 * Shared card movement primitives are handled by CyberpunkSharedAnimationLayer.
 *
 * Captures a snapshot of every `[data-card-id]` element after each render —
 * the "previous" snapshot is what we read source rects/HTML from when a
 * cardMoved or cardDefeated event arrives, since the live DOM has already
 * been reconciled to the new state.
 */
export function ScriptPlayer({ speed = 1 }: ScriptPlayerProps): null {
  const { rawEngineEvents } = useEngine();
  const reduced = useReducedMotion();
  const effectiveSpeed = reduced ? 0 : speed;

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef<CardDomCache>({
    previous: new Map(),
    current: new Map(),
    previousDice: new Map(),
    currentDice: new Map(),
  });
  const lastProcessedIdRef = useRef<number>(0);
  const pendingTimersRef = useRef<Set<number>>(new Set());

  useLayoutEffect(() => {
    cacheRef.current.previous = cacheRef.current.current;
    cacheRef.current.current = snapshotDom();
    cacheRef.current.previousDice = cacheRef.current.currentDice;
    cacheRef.current.currentDice = snapshotDiceDom();
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const node = document.createElement("div");
    node.className = classes.overlay;
    document.body.appendChild(node);
    overlayRef.current = node;
    const timers = pendingTimersRef.current;
    return () => {
      for (const id of timers) {
        window.clearTimeout(id);
      }
      timers.clear();
      node.remove();
      overlayRef.current = null;
    };
  }, []);

  useEffect(() => {
    // EngineProvider resets `rawEngineEvents` and its id counter back to 0
    // on scenario change / restart. Detect the regression and reset our
    // high-water mark so post-reset entries (ids starting at 1) animate.
    const maxId = rawEngineEvents.length > 0 ? rawEngineEvents[rawEngineEvents.length - 1].id : 0;
    if (maxId < lastProcessedIdRef.current) {
      lastProcessedIdRef.current = 0;
    }

    if (effectiveSpeed === 0) {
      // Reduced motion / paused: mark all entries processed so we don't
      // backfill animations when motion is re-enabled mid-game.
      for (const entry of rawEngineEvents) {
        if (entry.id > lastProcessedIdRef.current) {
          lastProcessedIdRef.current = entry.id;
        }
      }
      return;
    }
    const overlay = overlayRef.current;
    if (!overlay) return;
    const newEntries: RawEngineEventEntry[] = [];
    for (const entry of rawEngineEvents) {
      if (entry.id > lastProcessedIdRef.current) {
        newEntries.push(entry);
      }
    }
    if (newEntries.length === 0) return;
    for (const entry of newEntries) {
      lastProcessedIdRef.current = entry.id;
      playScript(
        entry.animationScript,
        overlay,
        cacheRef.current,
        effectiveSpeed,
        pendingTimersRef.current,
      );
    }
  }, [rawEngineEvents, effectiveSpeed]);

  return null;
}

function playScript(
  script: AnimationScript,
  overlay: HTMLElement,
  cache: CardDomCache,
  speed: number,
  pendingTimers: Set<number>,
): void {
  if (script.steps.length === 0) return;

  for (const step of script.steps) {
    if (isCyberpunkAnimationStepSharedSupported(step)) {
      continue;
    }
    const delay = step.startMs / speed;
    const duration = step.durationMs / speed;
    const timerId = window.setTimeout(() => {
      pendingTimers.delete(timerId);
      if (typeof document === "undefined" || !overlay.isConnected) {
        return;
      }
      if (step.kind === "cardLand") {
        void playCardLand({ step, durationMs: duration });
      } else if (step.kind === "combat") {
        void playCombat({
          step,
          overlay,
          durationMs: duration,
          sideForPlayerId,
        });
      } else if (step.kind === "gigMove") {
        void playGigMove({
          step,
          cache,
          overlay,
          durationMs: duration,
          sideForPlayerId,
        });
      } else if (step.kind === "phaseChange") {
        void phaseChange({ step, overlay, durationMs: duration });
      } else if (step.kind === "resourceFloat") {
        void playResourceFloat({
          step,
          overlay,
          durationMs: duration,
          sideForPlayerId,
        });
      }
      // Step kinds we haven't implemented yet intentionally fall through.
    }, delay);
    pendingTimers.add(timerId);
  }
}
