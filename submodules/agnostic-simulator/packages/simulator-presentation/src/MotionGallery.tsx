import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CardSurface } from "@tcg/simulator-presentation/dom";
import { CardSequence } from "@tcg/simulator-presentation/sequence";
import { SimulatorEffectCanvas } from "@tcg/simulator-presentation/canvas";
import {
  initSimulatorSoundService,
  playSimulatorSound,
  setSimulatorSoundVolume,
} from "@tcg/simulator-presentation/audio/sound-service";
import type { SimulatorAudioCueId } from "@tcg/protocol";
import type { DomCardPose } from "./DomCardMotion";
import "./fixture.css";
export interface GalleryCard {
  id: string;
  name: string;
  imageUrl?: string;
}
export interface GalleryFixture {
  id: string;
  title: string;
  rule: string;
  rulesUrl?: string;
  detail: string;
  card: { name: string; imageUrl?: string };
  beats: {
    label: string;
    duration: number;
    poses: Record<string, DomCardPose>;
    cue?: SimulatorAudioCueId;
  }[];
}
export interface MotionGalleryConfig {
  tableOverlay?: ReactNode;
  game: string;
  rulesUrl: string;
  rulesLabel: string;
  fixtures: readonly GalleryFixture[];
  cards: (fixture: GalleryFixture) => GalleryCard[];
  zones: { label: string; x: number; y: number }[];
  selected?: (fixture: GalleryFixture, step: number, id: string) => boolean;
}

export function MotionGallery({ config }: { config: MotionGalleryConfig }) {
  const { fixtures: typeMotions, rulesUrl } = config;
  const [index, setIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [all, setAll] = useState(false);
  const [sound, setSound] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [version, setVersion] = useState(0);
  const [scale, setScale] = useState(1);
  const [fps, setFps] = useState(0);
  const [p95, setP95] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const samples = useRef<number[]>([]);
  useEffect(() => {
    // Warm artwork before a playlist reaches the next type; textures never load mid-flight.
    for (const fixture of typeMotions)
      if (fixture.card.imageUrl) {
        const image = new Image();
        image.src = fixture.card.imageUrl;
      }
  }, [typeMotions]);
  const fixture = typeMotions[index]!;
  const step = useMemo(() => ({ ...fixture.beats[stepIndex]! }), [fixture, stepIndex, version]);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(Math.min(entry.contentRect.width / 1280, entry.contentRect.height / 650));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setSimulatorSoundVolume(sound ? 38 : 0);
  }, [sound]);
  useEffect(() => {
    // Non-transfer effects fire now. Card travel cues are tied to actual launch/landing.
    if (running && !document.hidden && step.cue && !step.cue.startsWith("card."))
      playSimulatorSound(step.cue);
  }, [step, running]);
  const sample = useCallback(
    (ms: number) => {
      if (!reduced && ms > 0) samples.current.push(ms);
    },
    [reduced],
  );
  const done = useCallback(() => {
    if (!running) return;
    if (stepIndex < fixture.beats.length - 1) setStepIndex((i) => i + 1);
    else {
      const values = samples.current;
      const sorted = [...values].sort((a, b) => a - b);
      setP95(sorted[Math.floor(sorted.length * 0.95)] ?? 0);
      setFps(values.length ? 1000 / (values.reduce((a, b) => a + b, 0) / values.length) : 0);
      if (all && index < typeMotions.length - 1) {
        setIndex((i) => i + 1);
        setStepIndex(0);
      } else {
        setRunning(false);
        setAll(false);
      }
    }
  }, [running, stepIndex, fixture, all, index]);
  const start = async (playlist: boolean) => {
    await initSimulatorSoundService();
    samples.current = [];
    setFps(0);
    if (playlist) setIndex(0);
    setStepIndex(0);
    setVersion((v) => v + 1);
    setAll(playlist);
    setRunning(true);
  };
  const cards = config.cards(fixture);
  return (
    <main className="type-motion-page" data-reduced-motion={reduced}>
      <header>
        <div>
          <span className="eyebrow">TCG ONLINE / {config.game.toUpperCase()}</span>
          <h1>{fixture.title}</h1>
        </div>
        <div className="motion-controls">
          <label>
            <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />{" "}
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
            aria-label="Card motion"
            value={index}
            disabled={running}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              setStepIndex(0);
              setVersion((v) => v + 1);
            }}
          >
            {typeMotions.map((f, i) => (
              <option key={f.id} value={i}>
                {f.title}
              </option>
            ))}
          </select>
          <button disabled={running} onClick={() => void start(false)}>
            Replay motion
          </button>
          <button className="primary" disabled={running} onClick={() => void start(true)}>
            Play all {typeMotions.length}
          </button>
          {running && (
            <button
              onClick={() => {
                setRunning(false);
                setAll(false);
                setVersion((v) => v + 1);
              }}
            >
              Stop
            </button>
          )}
        </div>
      </header>
      <div className="motion-stage-frame" ref={frame}>
        <div className="motion-stage" style={{ transform: `translate(-50%,-50%) scale(${scale})` }}>
          <div className="arena-half opponent" />
          <div className="arena-half local" />
          <div className="arena-line" />
          {config.tableOverlay}
          {config.zones.map((zone) => (
            <span key={zone.label} className="zone-caption" style={{ left: zone.x, top: zone.y }}>
              {zone.label}
            </span>
          ))}
          <div className="motion-step" key={`${index}-${stepIndex}-${version}`}>
            <span className="eyebrow">
              {String(index + 1).padStart(2, "0")} / {typeMotions.length} ·{" "}
              {running ? "IN MOTION" : "TYPE STUDY"}
            </span>
            <h2>{step.label}</h2>
            <p>{fixture.detail}</p>
          </div>
          {cards.map((card) => (
            <CardSurface
              key={`${version}-${index}-${card.id}`}
              ref={(node) => {
                if (node) nodes.current.set(card.id, node);
                else nodes.current.delete(card.id);
              }}
              selected={config.selected?.(fixture, stepIndex, card.id)}
              interactive={config.selected?.(fixture, stepIndex, card.id)}
              imageUrl={card.imageUrl}
              aria-label={card.name}
              role="img"
              fallback={
                !card.imageUrl ? (
                  <div className="sample-card">
                    <span>TYPE STUDY</span>
                    <b>{card.name.split(" · ")[0]}</b>
                    <span>◇</span>
                    <small>Schematic · No printed card art</small>
                  </div>
                ) : undefined
              }
            />
          ))}
          <SimulatorEffectCanvas active={running}>
            <CardSequence
              key={`${version}-${index}`}
              step={step}
              nodes={nodes}
              reduced={reduced || !running}
              onDone={done}
              onSample={sample}
              onCardLaunch={(id) => {
                if (running && id === "subject") playSimulatorSound("card.draw");
              }}
              onCardLand={(id) => {
                if (running && id === "subject")
                  playSimulatorSound(step.cue?.startsWith("card.") ? step.cue : "card.move");
              }}
            />
          </SimulatorEffectCanvas>
        </div>
      </div>
      <footer>
        <span>Card movement study · Printed effects and payment choices omitted</span>
        <a href={fixture.rulesUrl ?? rulesUrl} target="_blank" rel="noreferrer">
          {config.rulesLabel} · {fixture.rule}
        </a>
        <span data-testid="motion-fps">
          {fps
            ? `${fps.toFixed(1)} FPS · p95 ${p95.toFixed(1)} ms · local sample`
            : "Shared R3F motion / card / audio components"}
        </span>
      </footer>
    </main>
  );
}
