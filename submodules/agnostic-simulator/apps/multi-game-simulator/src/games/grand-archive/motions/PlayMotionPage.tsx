import {
  nextTargetedBeat,
  targetedHoldMs,
  resolutionFocusPose,
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
import { cardSelection } from "@tcg/simulator-presentation/selection";
import {
  initSimulatorSoundService,
  playSimulatorSound,
  setSimulatorSoundVolume,
} from "@tcg/simulator-presentation/audio/sound-service";
import type { SimulatorAudioCueId } from "@tcg/protocol";
import { slots, subjects } from "./fixtures";
import { grandArchiveOpeningCards as cards } from "../opening-cards";
import "@tcg/simulator-presentation/fixture-styles.css";
import "./play.css";
export type Phase =
  | "ready"
  | "flight"
  | "stack"
  | "disclose"
  | "targets"
  | "resolve"
  | "outcome"
  | "land"
  | "done"
  | "return";
export type Example = "ally" | "action" | "weapon";
export function nextPhase(example: Example, phase: Phase): Phase {
  if (phase === "flight") return "stack";
  if (phase === "stack" && example !== "action") return "land";
  const next = nextTargetedBeat(phase);
  if (next) return next;
  if (phase === "targets") return "land";
  if (phase === "land") return "done";
  return "ready";
}
function Clock({
  clock,
  phase,
  reduced,
  finish,
  sample,
}: {
  clock: { current: number };
  phase: Phase;
  reduced: boolean;
  finish: () => void;
  sample: (ms: number) => void;
}) {
  const done = useRef(false);
  useLayoutEffect(() => {
    clock.current = 0;
    done.current = false;
  }, [phase, clock]);
  useFrame((_, delta) => {
    if (document.hidden) return;
    clock.current += Math.min(50, delta * 1000);
    if (phase !== "ready" && phase !== "done") sample(delta * 1000);
    const duration = targetedHoldMs(phase, reduced);
    if (duration && !done.current && clock.current >= duration) {
      done.current = true;
      finish();
    }
  }, -1);
  return null;
}
const targets = [
  { id: "target-a", card: cards[6], pose: { ...slots.enemyA, left: 575 } },
  { id: "target-b", card: cards[1], pose: { ...slots.enemyB, left: 775 } },
];
export function GrandArchivePlayMotionPage() {
  const [example, setExample] = useState<Example>("ally"),
    [phase, setPhase] = useState<Phase>("ready");
  const [sound, setSound] = useState(true),
    [reduced, setReduced] = useState(false),
    [scale, setScale] = useState(1);
  const [target, setTarget] = useState("target-a"),
    [version, setVersion] = useState(0),
    [inspect, setInspect] = useState(false);
  const [handoff, setHandoff] = useState<{ key: number; pose: DomCardPose }>();
  const [metrics, setMetrics] = useState("Ready"),
    [notice, setNotice] = useState("Drag onto the table, or use Play card.");
  const nodes = useRef(new Map<string, HTMLDivElement>()),
    board = useRef<HTMLDivElement>(null),
    frame = useRef<HTMLDivElement>(null);
  const clock = useRef(0),
    serial = useRef(0),
    samples = useRef<number[]>([]),
    audible = useRef(sound),
    reaction = useRef<CardReaction>({ x: 0, y: 0, scale: 1, opacity: 1 });
  audible.current = sound;
  const cue = useCallback(
    (id: SimulatorAudioCueId) => playSimulatorSound(id, () => audible.current && !document.hidden),
    [],
  );
  const busy = phase !== "ready" && phase !== "done",
    targeted = example === "action";
  const card = subjects[example],
    origin = example === "weapon" ? { ...slots.material, face: true } : slots.hand;
  const destination =
    example === "action" ? slots.graveyard : example === "weapon" ? slots.weapon : slots.field;
  useEffect(() => {
    setSimulatorSoundVolume(sound ? 65 : 0);
  }, [sound]);
  useEffect(() => {
    for (const card of [...Object.values(subjects), ...targets.map((t) => t.card)])
      if (card.imageUrl) {
        const image = new Image();
        image.src = card.imageUrl;
      }
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
  }, []);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([e]) => {
      if (e) setScale(Math.min(e.contentRect.width / 1280, e.contentRect.height / 650));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const finish = useCallback(() => setPhase((p) => nextPhase(example, p)), [example]);
  const sample = useCallback(
    (ms: number) => {
      if (!reduced && ms > 0) samples.current.push(ms);
    },
    [reduced],
  );
  useEffect(() => {
    if (phase === "resolve") cue("effect.trigger");
    if (phase === "done") {
      const values = samples.current,
        sorted = [...values].sort((a, b) => a - b);
      setMetrics(
        reduced
          ? "Reduced motion"
          : `${(1000 / (values.reduce((a, b) => a + b, 0) / Math.max(1, values.length))).toFixed(1)} FPS · p95 ${(sorted[Math.floor(sorted.length * 0.95)] ?? 0).toFixed(1)} ms · local`,
      );
      setNotice(
        targeted
          ? "Fireball resolved: 1 damage at champion level 0. Action is in the graveyard."
          : `${card.name} is on the field.`,
      );
    }
  }, [phase, cue, reduced, targeted, card.name]);
  const reset = () => {
    setPhase("ready");
    setHandoff(undefined);
    setVersion((v) => v + 1);
    setInspect(false);
    setMetrics("Ready");
    setNotice("Drag onto the table, or use Play card.");
    samples.current = [];
  };
  const release = (pose: DomCardPose, valid: boolean) => {
    setHandoff({ key: ++serial.current, pose });
    samples.current = [];
    setPhase(
      valid
        ? "flight"
        : Math.hypot(pose.left - origin.left, pose.top - origin.top) > 0.1
          ? "return"
          : "ready",
    );
    setNotice(
      valid
        ? "Playing card · costs and legality assumed satisfied."
        : "Outside the play area · no card played.",
    );
  };
  const drag = usePresentationCardDrag({
    board,
    pose: origin,
    enabled: phase === "ready",
    onDrop: (pose, point) => {
      const r = board.current!.getBoundingClientRect();
      const y = ((point.y - r.top) * 650) / r.height;
      release(pose, pointInsideCardSpace(point, r) && y >= 20 && y <= 490);
    },
    onCancel: (p) => release(p, false),
  });
  const step = useMemo(() => ({ phase, example, version }), [phase, example, version]);
  const targetArrived = useTargetArrivals(phase === "targets", handoff?.key, [target], finish);
  const selected = targets.find((t) => t.id === target)!;
  const highlight = targeted && ["ready", "disclose", "resolve", "outcome"].includes(phase);
  const targetPose = {
    ...selected.pose,
    width: selected.pose.width * cardSelection.scale,
    height: selected.pose.height * cardSelection.scale,
    left: selected.pose.left - (selected.pose.width * (cardSelection.scale - 1)) / 2,
    top:
      selected.pose.top -
      (selected.pose.height * (cardSelection.scale - 1)) / 2 -
      cardSelection.lift,
  };
  const titles: Record<Phase, string> = {
    ready: example === "weapon" ? "Materialize a weapon" : "Activate a card",
    flight: "Playing card…",
    stack: "Effects Stack · opportunity to respond",
    disclose: "Target confirmed",
    targets: "Target complete · acting card may leave",
    resolve: "Resolving Fireball",
    outcome: "1 damage · target remains on field",
    land: targeted ? "Resolution complete · graveyard" : "Resolve · enter the field",
    done: "Complete",
    return: "Return to origin",
  };
  const subjectPose =
    phase === "ready" || phase === "return"
      ? origin
      : phase === "land" || phase === "done"
        ? destination
        : targeted
          ? resolutionFocusPose()
          : slots.stack;
  return (
    <main className="type-motion-page ga-play" data-phase={phase} data-reduced-motion={reduced}>
      <header>
        <div>
          <span className="eyebrow">GRAND ARCHIVE / PLAY & RESOLVE</span>
          <h1>{card.name}</h1>
        </div>
        <div className="motion-controls">
          <label>
            <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
            Sound
          </label>
          <label>
            <input
              type="checkbox"
              checked={reduced}
              onChange={(e) => setReduced(e.target.checked)}
            />
            Reduced motion
          </label>
          <select
            aria-label="Play example"
            value={example}
            disabled={busy || drag.dragging}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "ally" || value === "action" || value === "weapon") {
                setExample(value);
                setTarget("target-a");
                reset();
              }
            }}
          >
            <option value="ally">Ally · Hasty Messenger</option>
            <option value="action">Action · Fireball</option>
            <option value="weapon">Regalia Weapon · Training Sword</option>
          </select>
          <button disabled={busy || drag.dragging} onClick={reset}>
            Reset
          </button>
          <button
            className="primary"
            disabled={phase !== "ready" || drag.dragging}
            onClick={() => {
              void initSimulatorSoundService();
              release(origin, true);
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
          <div className="ga-drop" data-active={drag.dragging}>
            Release anywhere on the playfield
          </div>
          <div className="motion-step">
            <span className="eyebrow">
              {example === "weapon"
                ? "MATERIALIZE PHASE"
                : targeted
                  ? "OPPORTUNITY · FAST ACTION"
                  : "MAIN PHASE · SLOW SPEED"}
            </span>
            <h2 aria-live="polite">{titles[phase]}</h2>
            <p>
              {targeted
                ? "Fireball · 1 + LV damage to target unit. Your Spirit is level 0."
                : example === "weapon"
                  ? "Material deck → Effects Stack → field."
                  : "Hand → Effects Stack → field, awake."}
            </p>
            {targeted && highlight && phase !== "ready" && (
              <p className="ga-target-summary">
                {card.name} · {selected.card.name}
              </p>
            )}
          </div>
          {[
            { label: "MATERIAL", x: 115, y: 627 },
            { label: "CHAMPION", x: 198, y: 463 },
            { label: "EFFECTS STACK", x: targeted ? 1005 : 545, y: targeted ? 480 : 388 },
            { label: "FIELD", x: 713, y: 535 },
            { label: "GRAVEYARD", x: 1095, y: 612 },
          ].map((z) => (
            <span key={z.label} className="zone-caption" style={{ left: z.x, top: z.y }}>
              {z.label}
            </span>
          ))}
          <CardSurface
            key={`subject-${example}`}
            className="ga-subject"
            ref={(n) => {
              if (n) nodes.current.set("subject", n);
              else nodes.current.delete("subject");
            }}
            imageUrl={card.imageUrl}
            selected={targeted && ["disclose", "resolve", "outcome", "targets"].includes(phase)}
            interactive
            role="button"
            tabIndex={phase === "ready" ? 0 : -1}
            aria-label={`Play ${card.name}`}
            aria-disabled={phase !== "ready"}
            onPointerEnter={() => setInspect(true)}
            onPointerLeave={() => setInspect(false)}
            onFocus={() => setInspect(true)}
            onBlur={() => setInspect(false)}
            {...drag.bindings}
            onPointerDown={(e) => {
              void initSimulatorSoundService();
              drag.bindings.onPointerDown(e);
            }}
            onKeyDown={(e) => {
              if (phase === "ready" && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                void initSimulatorSoundService();
                release(origin, true);
              }
            }}
          />
          <CardSurface
            ref={(n) => {
              if (n) nodes.current.set("hero", n);
              else nodes.current.delete("hero");
            }}
            imageUrl={cards[0].imageUrl}
          />
          {targets.map((t) => (
            <CardSurface
              key={t.id}
              className="ga-target"
              ref={(n) => {
                if (n) nodes.current.set(t.id, n);
                else nodes.current.delete(t.id);
              }}
              imageUrl={t.card.imageUrl}
              selected={highlight && target === t.id}
              interactive={targeted}
              role="button"
              tabIndex={targeted && phase === "ready" ? 0 : -1}
              aria-label={`Target ${t.card.name}`}
              aria-pressed={targeted && target === t.id}
              aria-disabled={!targeted || phase !== "ready"}
              onClick={() => {
                if (targeted && phase === "ready") setTarget(t.id);
              }}
              onKeyDown={(e) => {
                if (targeted && phase === "ready" && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setTarget(t.id);
                }
              }}
            />
          ))}
          {targeted && ["outcome", "targets", "land", "done"].includes(phase) && (
            <div
              className="ga-damage"
              style={{
                left: selected.pose.left,
                top: selected.pose.top + selected.pose.height + 12,
              }}
            >
              1 damage
            </div>
          )}
          {phase === "outcome" && (
            <ResolutionValue
              value="−1"
              x={targetPose.left + targetPose.width / 2}
              y={targetPose.top + targetPose.height / 2}
            />
          )}
          <div className="ga-vfx">
            <SimulatorEffectCanvas active={busy || drag.dragging}>
              <Clock
                phase={phase}
                clock={clock}
                reduced={reduced}
                finish={finish}
                sample={sample}
              />
              <CardResolutionEffect
                source={resolutionFocusPose()}
                target={targetPose}
                clock={clock}
                eventKey={handoff?.key}
                phase={
                  !targeted
                    ? "idle"
                    : phase === "disclose"
                      ? "pending"
                      : phase === "resolve" || phase === "outcome"
                        ? phase
                        : "idle"
                }
                kind="damage"
                inspect={phase === "disclose" || inspect}
                reduced={reduced}
                reaction={reaction}
                onImpact={() => {
                  cue("combat.hit");
                  finish();
                }}
              />
              <DomCardMotion
                key={`subject-${version}-${example}`}
                id="subject"
                restingElevation={targeted && isResolutionFocus(phase) ? 0.85 : 0}
                stackOrder={65}
                pose={subjectPose}
                clock={clock}
                motionKey={step}
                timed
                dealing={false}
                nodes={nodes}
                reduced={reduced}
                handoff={handoff}
                dragPose={drag.dragPose}
                onLaunch={() => {
                  if (busy) cue("card.draw");
                }}
                onLand={() => {
                  if (phase === "return") setPhase("ready");
                  else if (phase === "flight" || phase === "land") {
                    cue(phase === "flight" ? "card.move" : targeted ? "card.discard" : "card.play");
                    finish();
                  }
                }}
              />
              <DomCardMotion
                id="hero"
                pose={slots.champion}
                clock={clock}
                motionKey={step}
                timed
                dealing={false}
                nodes={nodes}
                reduced={reduced}
              />
              {targets.map((t) => (
                <DomCardMotion
                  key={`${t.id}-${version}`}
                  id={t.id}
                  onLand={() => {
                    if (phase === "targets" && t.id === target) {
                      cue("card.move");
                      targetArrived(t.id);
                    }
                  }}
                  pose={highlight && target === t.id ? targetPose : t.pose}
                  clock={clock}
                  motionKey={step}
                  timed
                  dealing={false}
                  nodes={nodes}
                  reduced={reduced}
                  reaction={target === t.id ? reaction : undefined}
                />
              ))}
            </SimulatorEffectCanvas>
          </div>
        </div>
      </div>
      <footer>
        <span aria-live="polite">{notice}</span>
        <span>{sound ? "Sound on" : "Muted"}</span>
        <span data-testid="ga-play-fps">{metrics}</span>
        <span>Presentation fixture · costs and legality assumed</span>
      </footer>
    </main>
  );
}
