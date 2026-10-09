import {
  targetedHoldMs,
  isResolutionFocus,
  useTargetArrivals,
} from "@tcg/simulator-presentation/targeted-resolution";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CardSurface,
  DomCardMotion,
  ResolutionValue,
  usePresentationCardDrag,
  pointInsideCardSpace,
  type DomCardPose,
} from "@tcg/simulator-presentation/dom";
import { SimulatorEffectCanvas } from "@tcg/simulator-presentation/canvas";
import { CardResolutionEffect } from "@tcg/simulator-presentation/resolution";
import type { CardReaction } from "@tcg/simulator-presentation/resolution-motion";
import {
  initSimulatorSoundService,
  playSimulatorSound,
  setSimulatorSoundVolume,
} from "@tcg/simulator-presentation/audio/sound-service";
import {
  nextPlayPhase,
  releasedPlayPhase,
  playCards,
  playSlots,
  playTargetPose,
  type PlayKind,
  type PlayPhase,
} from "./play-fixtures";
import "./motions.css";
import "./play.css";

function PlayClock({
  phase,
  clock,
  onDone,
  onSample,
  reduced,
}: {
  reduced: boolean;
  phase: PlayPhase;
  clock: { current: number };
  onDone: () => void;
  onSample: (ms: number) => void;
}) {
  const complete = useRef(false);
  useLayoutEffect(() => {
    clock.current = 0;
    complete.current = false;
  }, [phase, clock]);
  useFrame((_, delta) => {
    if (document.hidden) return;
    clock.current += Math.min(delta * 1000, 50);
    if (!["idle", "complete"].includes(phase)) onSample(delta * 1000);
    const duration = targetedHoldMs(phase, reduced);
    if (duration && !complete.current && clock.current >= duration) {
      complete.current = true;
      onDone();
    }
  }, -1);
  return null;
}
export function PlayMotionPage() {
  const [resetKey, setResetKey] = useState(0);
  const [inspecting, setInspecting] = useState(false);
  const [p95, setP95] = useState(0);
  const targetReaction = useRef<CardReaction>({ x: 0, y: 0, scale: 1, opacity: 1 });
  const [kind, setKind] = useState<PlayKind>("clash"),
    [phase, setPhase] = useState<PlayPhase>("idle");
  const [scale, setScale] = useState(1),
    [muted, setMuted] = useState(false),
    [reduced, setReduced] = useState(false);
  const [target, setTarget] = useState("enemy-a"),
    [handoff, setHandoff] = useState<{ key: number; pose: DomCardPose }>();
  const [notice, setNotice] = useState("Drag the card onto the table, or use Play card.");
  const [cue, setCue] = useState("Ready"),
    [fps, setFps] = useState(0);
  const nodes = useRef(new Map<string, HTMLDivElement>()),
    board = useRef<HTMLDivElement>(null),
    frame = useRef<HTMLDivElement>(null),
    clock = useRef(0),
    serial = useRef(0),
    samples = useRef<number[]>([]);
  const card = playCards[kind],
    selected = target === "enemy-a";
  const busy = !["idle", "complete"].includes(phase);
  const sound = useCallback(
    (
      name:
        | "card.draw"
        | "card.move"
        | "card.play"
        | "effect.trigger"
        | "combat.hit"
        | "card.discard",
      label: string,
    ) => {
      if (!document.hidden) {
        playSimulatorSound(name);
        setCue(label);
      }
    },
    [],
  );
  useEffect(() => {
    setSimulatorSoundVolume(muted ? 0 : 65);
  }, [muted]);
  useEffect(() => {
    for (const entry of Object.values(playCards)) {
      const image = new Image();
      image.src = `https://tcgplayer-cdn.tcgplayer.com/product/${entry.product}_400w.jpg`;
    }
  }, []);
  useEffect(() => {
    if (!frame.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(Math.min(entry.contentRect.width / 1280, entry.contentRect.height / 650));
    });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  const finish = useCallback(() => setPhase((current) => nextPlayPhase(kind, current)), [kind]);
  const sample = useCallback(
    (ms: number) => {
      if (!reduced && ms > 0) samples.current.push(ms);
    },
    [reduced],
  );
  useEffect(() => {
    if (phase === "resolve") sound("effect.trigger", "Resolve · effect cue");
    if (phase === "complete") {
      const sorted = [...samples.current].sort((a, b) => a - b);
      setP95(sorted[Math.max(0, Math.ceil(sorted.length * 0.95) - 1)] ?? 0);
      setFps(
        samples.current.length
          ? 1000 / (samples.current.reduce((a, b) => a + b, 0) / samples.current.length)
          : 0,
      );
      setNotice(
        kind === "clash"
          ? "Clash card is in play, ready."
          : "Action resolved. The card is now in Oblivion.",
      );
    }
  }, [phase, kind, sound]);
  const reset = () => {
    setResetKey((value) => value + 1);
    setPhase("idle");
    setHandoff(undefined);
    setInspecting(false);
    setNotice("Drag the card onto the table, or use Play card.");
    setCue("Ready");
    samples.current = [];
    setFps(0);
    setP95(0);
  };
  const release = useCallback((pose: DomCardPose, valid: boolean) => {
    setHandoff({ key: ++serial.current, pose });
    samples.current = [];
    setFps(0);
    setNotice(
      valid
        ? "Card released. Waiting for its arrival in Standby."
        : "Outside play area. Returning to hand; nothing was played.",
    );
    setPhase(releasedPlayPhase(pose, valid));
  }, []);
  const drag = usePresentationCardDrag({
    board,
    pose: playSlots.hand,
    enabled: phase === "idle",
    onDrop: (pose, point) => {
      const rect = board.current!.getBoundingClientRect();
      const localY = ((point.y - rect.top) * 650) / rect.height;
      release(pose, pointInsideCardSpace(point, rect) && localY >= 20 && localY <= 490);
    },
    onCancel: (pose) => release(pose, false),
  });
  const targetArrived = useTargetArrivals(
    phase === "targets",
    handoff?.key,
    kind !== "clash" ? [target] : [],
    finish,
  );
  const targetA = playTargetPose(kind, phase, selected),
    targetB = playTargetPose(kind, phase, !selected, true);
  const subjectPose =
    phase === "idle" || phase === "return"
      ? playSlots.hand
      : phase === "enter" || (phase === "complete" && kind === "clash")
        ? playSlots.field
        : phase === "discard" || phase === "complete"
          ? playSlots.discard
          : kind === "clash"
            ? playSlots.standby
            : playSlots.focus;
  const subjectStep = useMemo(() => ({ phase, kind }), [phase, kind]);
  const showTarget = kind !== "clash" && ["disclose", "resolve", "outcome"].includes(phase);
  const targetPose = selected
    ? playTargetPose(kind, "disclose", true)
    : playTargetPose(kind, "disclose", true, true);
  const targetName = selected ? "Pestilence, World Degrader" : "Captain Maxine Riggins";
  const titles: Record<PlayPhase, string> = {
    idle: card.window,
    flight: "Playing card…",
    standby: "In Standby · response window",
    disclose: "Target confirmed",
    targets: "Move affected card · acting card waits",
    resolve: `Resolving ${card.name}`,
    outcome:
      kind === "quick"
        ? "2 damage · target remains in play"
        : "Target resolved · prepare zone transfer",
    discard: "Resolution complete · discard Action",
    enter: "Entering the Clash Zone",
    complete: "Complete",
    return: "Return to hand",
  };
  return (
    <main
      className="type-motion-page play-motion-page"
      data-reduced-motion={reduced}
      data-phase={phase}
    >
      <header>
        <div>
          <span className="eyebrow">ALPHA CLASH / PLAY & RESOLVE</span>
          <h1>{card.type}</h1>
        </div>
        <div className="motion-controls">
          <label>
            <input type="checkbox" checked={!muted} onChange={(e) => setMuted(!e.target.checked)} />{" "}
            Sound
          </label>
          <label>
            <input
              type="checkbox"
              checked={reduced}
              onChange={(e) => setReduced(e.target.checked)}
            />{" "}
            Reduced motion
          </label>
          <select
            aria-label="Play example"
            value={kind}
            disabled={busy || drag.dragging}
            onChange={(e) => {
              setKind(e.target.value as PlayKind);
              setTarget("enemy-a");
              reset();
            }}
          >
            <option value="clash">Clash card</option>
            <option value="basic">Basic Action · Deliverance</option>
            <option value="quick">Quick Action · Piercing Strike</option>
          </select>
          <button disabled={busy || drag.dragging} onClick={reset}>
            Reset
          </button>
          <button
            className="primary"
            disabled={phase !== "idle" || drag.dragging}
            onClick={() => {
              void initSimulatorSoundService();
              release(playSlots.hand, true);
            }}
          >
            Play card
          </button>
        </div>
      </header>
      <div className="motion-stage-frame" ref={frame}>
        <div
          className="motion-stage"
          ref={board}
          style={{ transform: `translate(-50%,-50%) scale(${scale})` }}
        >
          <div className="arena-half opponent" />
          <div className="arena-half local" />
          <div className="arena-line" />
          <div className="play-drop-zone" data-active={drag.dragging}>
            Release anywhere in this area
          </div>
          <div className="motion-step">
            <span className="eyebrow">{card.window}</span>
            <h2 aria-live="polite">{titles[phase]}</h2>
            <p>{card.effect}</p>
            {showTarget && (
              <p className="resolution-summary">
                {card.name} <span>→</span> {targetName}
              </p>
            )}
          </div>
          <span
            className="zone-caption"
            style={{
              visibility: kind === "clash" || isResolutionFocus(phase) ? "visible" : "hidden",
              left: kind === "clash" ? 465 : 1010,
              top: kind === "clash" ? 402 : 480,
            }}
          >
            STANDBY
          </span>
          <span className="zone-caption" style={{ left: 660, top: 526 }}>
            CLASH ZONE
          </span>
          <span className="zone-caption" style={{ left: 1040, top: 599 }}>
            OBLIVION
          </span>
          <span className="zone-caption" style={{ left: 600, top: 110 }}>
            OPPONENT
          </span>
          <CardSurface
            className="play-subject"
            ref={(n) => {
              if (n) nodes.current.set("subject", n);
              else nodes.current.delete("subject");
            }}
            imageUrl={`https://tcgplayer-cdn.tcgplayer.com/product/${card.product}_400w.jpg`}
            role="button"
            tabIndex={phase === "idle" || phase === "standby" ? 0 : -1}
            selected={showTarget}
            interactive
            onPointerEnter={() => setInspecting(true)}
            onPointerLeave={() => setInspecting(false)}
            onFocus={() => setInspecting(true)}
            onBlur={() => setInspecting(false)}
            aria-label={`Play ${card.name}`}
            aria-disabled={phase !== "idle"}
            {...drag.bindings}
            onPointerDown={(e) => {
              void initSimulatorSoundService();
              drag.bindings.onPointerDown(e);
            }}
            onKeyDown={(e) => {
              if (phase === "idle" && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                void initSimulatorSoundService();
                release(playSlots.hand, true);
              }
            }}
          />
          {[
            { id: "enemy-a", name: "Pestilence, World Degrader", product: 535365 },
            { id: "enemy-b", name: "Captain Maxine Riggins", product: 534928 },
          ].map((enemy) => (
            <CardSurface
              key={enemy.id}
              ref={(n) => {
                if (n) nodes.current.set(enemy.id, n);
                else nodes.current.delete(enemy.id);
              }}
              imageUrl={`https://tcgplayer-cdn.tcgplayer.com/product/${enemy.product}_400w.jpg`}
              className="play-target"
              selected={kind !== "clash" && target === enemy.id && (phase === "idle" || showTarget)}
              interactive={kind !== "clash"}
              role="button"
              tabIndex={kind === "basic" && phase === "idle" ? 0 : -1}
              aria-label={`Target ${enemy.name}`}
              aria-pressed={kind !== "clash" && target === enemy.id}
              onClick={() => {
                if (kind === "basic" && phase === "idle") setTarget(enemy.id);
              }}
              onKeyDown={(e) => {
                if (kind === "basic" && phase === "idle" && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setTarget(enemy.id);
                }
              }}
            />
          ))}
          {kind === "quick" && (
            <div className="damage-readout" style={{ left: 575, top: 328 }}>
              {["outcome", "targets", "discard", "complete"].includes(phase)
                ? "2 / 2 · 2 damage"
                : "2 / 4 · Attacking"}
            </div>
          )}
          {kind === "quick" && phase === "outcome" && (
            <ResolutionValue
              value="−2"
              x={targetPose.left + targetPose.width / 2}
              y={targetPose.top + targetPose.height / 2}
            />
          )}
          <div className="play-vfx" aria-hidden="true">
            <SimulatorEffectCanvas active={busy || drag.dragging}>
              <PlayClock
                reduced={reduced}
                phase={phase}
                clock={clock}
                onDone={finish}
                onSample={sample}
              />
              <CardResolutionEffect
                source={playSlots.focus}
                target={targetPose}
                clock={clock}
                phase={
                  kind === "clash"
                    ? "idle"
                    : phase === "disclose"
                      ? "pending"
                      : phase === "resolve" || phase === "outcome"
                        ? phase
                        : "idle"
                }
                eventKey={handoff?.key}
                kind={kind === "basic" ? "remove" : "damage"}
                inspect={phase === "disclose" || inspecting}
                reduced={reduced}
                reaction={targetReaction}
                onImpact={() => {
                  sound(
                    kind === "quick" ? "combat.hit" : "card.discard",
                    kind === "quick" ? "Impact · damage cue" : "Impact · removal cue",
                  );
                  finish();
                }}
              />
              <DomCardMotion
                key={resetKey}
                id="subject"
                restingElevation={kind !== "clash" && isResolutionFocus(phase) ? 0.85 : 0}
                stackOrder={65}
                pose={subjectPose}
                clock={clock}
                motionKey={subjectStep}
                timed
                dealing={false}
                nodes={nodes}
                reduced={reduced}
                handoff={handoff}
                dragPose={drag.dragPose}
                onLaunch={() => {
                  if (busy)
                    sound(
                      "card.draw",
                      phase === "return" ? "Return · movement cue" : "Release · movement cue",
                    );
                }}
                onLand={() => {
                  if (phase === "return") {
                    setPhase("idle");
                    setCue("Returned · no play confirmation");
                    return;
                  }
                  if (["flight", "enter", "discard"].includes(phase)) {
                    sound(
                      phase === "discard"
                        ? "card.discard"
                        : phase === "enter"
                          ? "card.play"
                          : "card.move",
                      phase === "enter"
                        ? "Landed · card in play"
                        : phase === "discard"
                          ? "Landed · Oblivion"
                          : "Landed · Standby",
                    );
                    finish();
                  }
                }}
              />
              <DomCardMotion
                key={`enemy-a-${resetKey}`}
                id="enemy-a"
                onLand={() => {
                  if (phase === "targets" && selected) {
                    sound(
                      kind === "basic" ? "card.discard" : "card.move",
                      kind === "basic" ? "Target arrived · Oblivion" : "Target settled",
                    );
                    targetArrived("enemy-a");
                  }
                }}
                reaction={selected ? targetReaction : undefined}
                pose={targetA}
                clock={clock}
                motionKey={subjectStep}
                timed
                dealing={false}
                nodes={nodes}
                reduced={reduced}
              />
              <DomCardMotion
                key={`enemy-b-${resetKey}`}
                id="enemy-b"
                onLand={() => {
                  if (phase === "targets" && !selected) {
                    sound(
                      kind === "basic" ? "card.discard" : "card.move",
                      kind === "basic" ? "Target arrived · Oblivion" : "Target settled",
                    );
                    targetArrived("enemy-b");
                  }
                }}
                reaction={!selected ? targetReaction : undefined}
                pose={targetB}
                clock={clock}
                motionKey={subjectStep}
                timed
                dealing={false}
                nodes={nodes}
                reduced={reduced}
              />
            </SimulatorEffectCanvas>
          </div>
        </div>
      </div>
      <footer>
        <span aria-live="polite">{notice}</span>
        <span data-testid="play-cue">{muted ? "Muted" : cue}</span>
        <span data-testid="play-fps">
          {fps
            ? `${fps.toFixed(1)} FPS · p95 ${p95.toFixed(1)} ms · local`
            : "Fixture · engine decisions assumed legal"}
        </span>
      </footer>
    </main>
  );
}
