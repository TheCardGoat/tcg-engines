import { defOf } from "@tcg/cyberpunk-engine";
import { useAnimationRuntime } from "@tcg/simulator-ui";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { useSimulatorSettings } from "../../../simulator/settings";
import { useEngine } from "../engine";
import { useAnimationSurfaceFrame } from "./animationSurfaceFrame";
import { createCyberpunkEffectAudio } from "./cyberpunk-effect-audio";
import {
  classifyCyberpunkEffectFx,
  type CyberpunkBoardWipeFx,
  type CyberpunkCompiledFxStep,
  type CyberpunkDefeatFx,
  type CyberpunkEffectFxPlan,
  type CyberpunkFxEntityIdentity,
  type CyberpunkGoSoloFx,
  type CyberpunkLockOnFx,
} from "./effect-fx";
import classes from "./CyberpunkCardEffectFxLayer.module.css";

interface FxPresentation {
  readonly transitionId: string;
  readonly plan: CyberpunkEffectFxPlan;
  readonly playbackStartedAtMs: number;
  readonly expiresAtMs: number;
}

/**
 * Cinematic card-effect feedback on top of the standard animation motion:
 * defeat glitches, cannot-attack target locks, Go Solo deploy columns, and the
 * Adam Smasher board-wipe spectacle, with sounds from the selected pack.
 * Shared by V1 and V2 — it portals above the board and measures live DOM
 * anchors, exactly like CyberpunkThreeFeedbackLayer.
 */
export function CyberpunkCardEffectFxLayer() {
  const runtime = useAnimationRuntime();
  const frame = useAnimationSurfaceFrame();
  const { matchState } = useEngine();
  const {
    settings: { soundVolume },
  } = useSimulatorSettings();

  const volumeGainRef = useRef<() => number>(() => 0);
  volumeGainRef.current = () => (Math.max(0, Math.min(100, soundVolume)) / 100) ** 2;
  const audioRef = useRef<ReturnType<typeof createCyberpunkEffectAudio>>(null);
  if (audioRef.current === null) {
    audioRef.current = createCyberpunkEffectAudio(() => volumeGainRef.current());
  }
  useEffect(() => () => audioRef.current?.dispose(), []);

  const resolveIdentity = useCallback(
    (entityId: string): CyberpunkFxEntityIdentity | undefined => {
      const card = matchState.G.cardIndex[entityId];
      if (!card) return undefined;
      const definition = defOf(card);
      return {
        canonicalId: definition.canonicalId,
        cardType: definition.type,
        title: definition.displayName ?? definition.name,
      };
    },
    [matchState],
  );

  const transition = runtime.activeTransition;
  const running = transition?.phase === "running";
  const compiledSteps: readonly CyberpunkCompiledFxStep[] = running
    ? (runtime.compiledPlan?.steps ?? [])
    : [];
  const [presentation, setPresentation] = useState<FxPresentation | null>(null);
  const capturedTransitionId = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (!running || !transition) return;
    if (capturedTransitionId.current === transition.id) return;
    capturedTransitionId.current = transition.id;
    const plan = classifyCyberpunkEffectFx(compiledSteps, resolveIdentity);
    if (import.meta.env.DEV) {
      // animationDebug aid: what the FX layer classified for this transition.
      (window as { __cyberpunkEffectFxPlan?: unknown }).__cyberpunkEffectFxPlan = plan;
    }
    if (
      plan.defeats.length === 0 &&
      plan.lockOns.length === 0 &&
      plan.goSolos.length === 0 &&
      !plan.wipe
    ) {
      return;
    }
    const playbackStartedAtMs = runtime.playbackStartedAtMs ?? performance.now();
    setPresentation({
      transitionId: transition.id,
      plan,
      playbackStartedAtMs,
      expiresAtMs: playbackStartedAtMs + plan.endAtMs,
    });
  }, [running, transition, compiledSteps, resolveIdentity, runtime.playbackStartedAtMs]);

  useEffect(() => {
    if (!presentation) return;
    const timer = window.setTimeout(
      () =>
        setPresentation((current) =>
          current?.transitionId === presentation.transitionId ? null : current,
        ),
      Math.max(0, presentation.expiresAtMs - performance.now()),
    );
    return () => window.clearTimeout(timer);
  }, [presentation]);

  const { plan, playbackStartedAtMs } = presentation ?? {};
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !plan) return;
    audio.cancelScheduled();
    const delay = (startAtMs: number) =>
      Math.max(0, startAtMs - (performance.now() - (playbackStartedAtMs ?? performance.now())));
    const wipedKeys = plan.wipe ? new Set(plan.wipe.targets.map((item) => item.key)) : null;
    for (const defeat of plan.defeats) {
      // Wiped units ride the board-wipe detonation instead of individual pops.
      if (wipedKeys?.has(defeat.key)) continue;
      audio.play("defeat", delay(defeat.startAtMs));
    }
    for (const lockOn of plan.lockOns) audio.play("lockOn", delay(lockOn.startAtMs));
    for (const goSolo of plan.goSolos) audio.play("goSolo", delay(goSolo.startAtMs));
    if (plan.wipe) {
      audio.play("wipeCharge", delay(plan.wipe.startAtMs));
      audio.play("wipeImpact", delay(plan.wipe.impactAtMs));
    }
    return () => audio.cancelScheduled();
  }, [plan, playbackStartedAtMs]);

  const wipe = presentation?.plan.wipe ?? null;
  useEffect(() => {
    if (!wipe) return;
    const board = document.querySelector<HTMLElement>("[data-sim-board]");
    board?.classList.add(classes.boardShake);
    return () => board?.classList.remove(classes.boardShake);
  }, [wipe]);

  if (typeof document === "undefined") return null;
  if (!presentation) return null;

  return createPortal(
    <div
      aria-hidden
      data-cyberpunk-effect-fx={presentation.transitionId}
      style={{
        position: frame.surface ? "absolute" : "fixed",
        inset: 0,
        zIndex: 1003,
        pointerEvents: "none",
      }}
    >
      {presentation.plan.wipe ? (
        <BoardWipeFx
          wipe={presentation.plan.wipe}
          playbackStartedAtMs={presentation.playbackStartedAtMs}
        />
      ) : null}
      {presentation.plan.defeats.map((item) => (
        <DefeatFx
          key={item.key}
          item={item}
          playbackStartedAtMs={presentation.playbackStartedAtMs}
        />
      ))}
      {presentation.plan.lockOns.map((item) => (
        <LockOnFx
          key={item.key}
          item={item}
          playbackStartedAtMs={presentation.playbackStartedAtMs}
        />
      ))}
      {presentation.plan.goSolos.map((item) => (
        <GoSoloFx
          key={item.key}
          item={item}
          playbackStartedAtMs={presentation.playbackStartedAtMs}
        />
      ))}
    </div>,
    frame.surface ?? document.body,
  );
}

/** Measure an entity's on-screen box once, in overlay-frame coordinates. */
function useEntityRect(entityId: string): DOMRect | null {
  const frame = useAnimationSurfaceFrame();
  const [rect, setRect] = useState<DOMRect | null>(null);
  useLayoutEffect(() => {
    let cancelled = false;
    // Board mounts carry the sim anchor; while an exit transfer parks at its
    // source (hold), the board slot is already gone and the parked transfer
    // clone is the visible stand-in at the same spot. Hold clones mount as
    // their step approaches, so poll briefly instead of measuring once — the
    // CSS animation delays keep the visuals aligned with the plan either way.
    const find = (): boolean => {
      for (const attribute of ["data-sim-entity-id", "data-three-card-transfer-entity"]) {
        const anchor = [...document.querySelectorAll<HTMLElement>(`[${attribute}]`)].find(
          (node) => node.getAttribute(attribute) === entityId && node.getClientRects().length > 0,
        );
        if (!anchor) continue;
        if (!cancelled) setRect(frame.mapRect(anchor.getBoundingClientRect()));
        return true;
      }
      return false;
    };
    if (find()) return;
    const timer = window.setInterval(() => {
      if (cancelled || find()) window.clearInterval(timer);
    }, 90);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [entityId, frame]);
  return rect;
}

function useBoardCenter(): { x: number; y: number } | null {
  const frame = useAnimationSurfaceFrame();
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    const board = document.querySelector<HTMLElement>("[data-sim-board]");
    if (!board) return;
    const rect = frame.mapRect(board.getBoundingClientRect());
    setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }, [frame]);
  return center;
}

function animationDelayMs(startAtMs: number, playbackStartedAtMs: number): number {
  return Math.max(0, Math.round(startAtMs - (performance.now() - playbackStartedAtMs)));
}

function anchorStyle(rect: DOMRect, delayMs: number, durationMs: number): CSSProperties {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    "--fx-delay": `${delayMs}ms`,
    "--fx-duration": `${Math.max(durationMs, 700)}ms`,
  } as CSSProperties;
}

function DefeatFx({
  item,
  playbackStartedAtMs,
}: {
  readonly item: CyberpunkDefeatFx;
  readonly playbackStartedAtMs: number;
}) {
  const rect = useEntityRect(item.entityId);
  if (!rect) return null;
  return (
    <div
      className={classes.defeatAnchor}
      data-fx-defeat={item.entityId}
      style={anchorStyle(
        rect,
        animationDelayMs(item.startAtMs, playbackStartedAtMs),
        item.durationMs,
      )}
    >
      <span className={classes.defeatRim} />
      <span className={classes.defeatGlitch} />
      <span className={classes.defeatShards} />
      <span className={classes.defeatTag}>DEFEATED</span>
    </div>
  );
}

function LockOnFx({
  item,
  playbackStartedAtMs,
}: {
  readonly item: CyberpunkLockOnFx;
  readonly playbackStartedAtMs: number;
}) {
  const rect = useEntityRect(item.entityId);
  if (!rect) return null;
  return (
    <div
      className={classes.lockAnchor}
      data-fx-lockon={item.entityId}
      style={anchorStyle(
        rect,
        animationDelayMs(item.startAtMs, playbackStartedAtMs),
        item.durationMs,
      )}
    >
      <i className={`${classes.lockCorner} ${classes.lockCornerTl}`} />
      <i className={`${classes.lockCorner} ${classes.lockCornerTr}`} />
      <i className={`${classes.lockCorner} ${classes.lockCornerBl}`} />
      <i className={`${classes.lockCorner} ${classes.lockCornerBr}`} />
      <span className={classes.lockSweep} />
      <span className={classes.lockStamp}>{item.label}</span>
    </div>
  );
}

function GoSoloFx({
  item,
  playbackStartedAtMs,
}: {
  readonly item: CyberpunkGoSoloFx;
  readonly playbackStartedAtMs: number;
}) {
  const rect = useEntityRect(item.entityId);
  if (!rect) return null;
  return (
    <div
      className={classes.soloAnchor}
      data-fx-gosolo={item.entityId}
      style={anchorStyle(
        rect,
        animationDelayMs(item.startAtMs, playbackStartedAtMs),
        item.durationMs,
      )}
    >
      <span className={classes.soloPillar} />
      <span className={classes.soloRing} />
      <span className={classes.soloSparks} />
      <span className={classes.soloTag}>GO SOLO</span>
    </div>
  );
}

function BoardWipeFx({
  wipe,
  playbackStartedAtMs,
}: {
  readonly wipe: CyberpunkBoardWipeFx;
  readonly playbackStartedAtMs: number;
}) {
  const sourceRect = useEntityRect(wipe.sourceEntityId ?? "");
  const boardCenter = useBoardCenter();
  const origin = sourceRect
    ? { x: sourceRect.left + sourceRect.width / 2, y: sourceRect.top + sourceRect.height / 2 }
    : boardCenter;
  if (!origin) return null;
  const startDelay = animationDelayMs(wipe.startAtMs, playbackStartedAtMs);
  const impactDelay = animationDelayMs(wipe.impactAtMs, playbackStartedAtMs);
  const totalMs = Math.max(wipe.endAtMs - wipe.startAtMs, 1200);
  const frameStyle = (delayMs: number) =>
    ({
      "--fx-delay": `${delayMs}ms`,
      "--wipe-cx": `${origin.x}px`,
      "--wipe-cy": `${origin.y}px`,
    }) as CSSProperties;
  return (
    <>
      <span className={classes.wipeFlash} data-fx-wipe="" style={frameStyle(startDelay)} />
      <span className={classes.wipeFlashSecondary} style={frameStyle(impactDelay)} />
      <span className={classes.wipeShock} style={frameStyle(impactDelay)} />
      <span
        className={classes.wipeVignette}
        style={{ ...frameStyle(startDelay), "--fx-duration": `${totalMs}ms` } as CSSProperties}
      />
      <div className={classes.wipeCaption} data-fx-wipe-caption="" style={frameStyle(impactDelay)}>
        <strong>{wipe.sourceTitle ?? "FIELD SWEPT"}</strong>
        <span>{wipe.sourceTitle ? "TOTAL DEFEAT" : "MASS DEFEAT"}</span>
      </div>
    </>
  );
}
