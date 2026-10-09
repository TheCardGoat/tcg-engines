import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { TurnOrderCoin } from "./TurnOrderCoin";
import { DomCardMotion } from "../dom";
import { openingLayout } from "./layout";
import { dealStagger, flightDuration, type OpeningBeat, type OpeningFixture } from "./types";

export interface OpeningMetrics {
  frames: number;
  p95: number;
  fps: number;
  slow: number;
  calls: number;
}
export interface OpeningNodes {
  readonly current: Map<string, HTMLDivElement>;
}

export function OpeningScene({
  fixture,
  beat,
  selected,
  inspected,
  nodes,
  reduced,
  onDone,
  onDraw,
  onMetrics,
  onCoinLand,
}: {
  fixture: OpeningFixture;
  beat: OpeningBeat;
  selected: readonly number[];
  inspected: number | null;
  nodes: OpeningNodes;
  reduced: boolean;
  onDone: () => void;
  onDraw: () => void;
  onCoinLand: () => void;
  onMetrics: (stats: OpeningMetrics) => void;
}) {
  const { size, gl, invalidate } = useThree();
  const layout = useMemo(
    () => (fixture.layout ?? openingLayout)(size.width, size.height, fixture.handSize),
    [size, fixture.handSize, fixture.layout],
  );
  const clock = useRef(0);
  const completed = useRef(false);
  const frames = useRef<number[]>([]);
  useLayoutEffect(() => {
    clock.current = 0;
    completed.current = false;
    if (beat.id === "ready") frames.current = [];
    invalidate();
  }, [beat, invalidate]);
  useFrame((_, delta) => {
    // Background tabs cannot skip the opening or play a backlog of sound cues.
    if (document.hidden) return;
    clock.current += Math.min(delta * 1000, 50);
    if (!beat.duration || completed.current) return;
    if (!reduced && clock.current > 80) frames.current.push(delta * 1000);
    const duration = reduced ? 80 : beat.duration;
    if (clock.current < duration) return;
    completed.current = true;
    const samples = frames.current.slice(-1200);
    const sorted = [...samples].sort((a, b) => a - b);
    if (!reduced)
      onMetrics({
        frames: samples.length,
        p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
        fps: samples.length ? 1000 / (samples.reduce((a, b) => a + b, 0) / samples.length) : 0,
        slow: samples.filter((ms) => ms > 20).length,
        calls: gl.info.render.calls,
      });
    onDone();
  }, -1);
  return (
    <>
      <TurnOrderCoin
        clock={clock}
        phase={beat.id === "toss" ? "toss" : beat.action === "order" ? "hold" : "hidden"}
        reduced={reduced}
        modelUrl={fixture.coinModelUrl}
        onLand={onCoinLand}
      />
      {/* Recessed table, paired playfields, and the central lane. Unlit geometry has
        no shadow maps, post-processing, or frame-dependent React updates. */}
      {fixture.renderTable ? (
        fixture.renderTable(size)
      ) : (
        <>
          <mesh position={[0, 0, -30]}>
            <planeGeometry args={[size.width, size.height]} />
            <meshBasicMaterial color="#122420" />
          </mesh>
          <mesh position={[0, size.height * 0.2, -29]}>
            <planeGeometry args={[size.width - 32, size.height * 0.38]} />
            <meshBasicMaterial color="#283d32" />
          </mesh>
          <mesh position={[0, -size.height * 0.2, -29]}>
            <planeGeometry args={[size.width - 32, size.height * 0.38]} />
            <meshBasicMaterial color="#30352d" />
          </mesh>
          <mesh position={[0, 0, -28]}>
            <planeGeometry args={[size.width - 24, 8]} />
            <meshBasicMaterial color="#6d6850" />
          </mesh>
        </>
      )}
      {[true, false].map((rival) => (
        <DomCardMotion
          key={`deck-${rival}`}
          id={`deck-${rival}`}
          role="deck"
          shuffling={beat.id === "shuffle" || (beat.id === "reshuffle" && !rival)}
          shuffleDuration={beat.duration}
          pose={layout.deck(rival)}
          clock={clock}
          motionKey={beat}
          timed={Boolean(beat.duration)}
          dealing={beat.id === "deal" || beat.id.startsWith("draw-") || beat.id === "redraw"}
          nodes={nodes}
          reduced={reduced}
        />
      ))}
      {fixture.auxiliaryDeck &&
        [true, false].map((rival) => (
          <DomCardMotion
            key={`deck-aux-${rival}`}
            id={`deck-aux-${rival}`}
            role="deck"
            pose={layout.auxiliary(rival)}
            clock={clock}
            motionKey={beat}
            timed={Boolean(beat.duration)}
            dealing={beat.id === "deal" || beat.id.startsWith("draw-") || beat.id === "redraw"}
            nodes={nodes}
            reduced={reduced}
          />
        ))}
      {[true, false].map((rival) => (
        <DomCardMotion
          key={`leader-${rival}`}
          id={`leader-${rival}`}
          role="leader"
          pose={layout.leader(rival, beat.leaders)}
          clock={clock}
          motionKey={beat}
          timed={Boolean(beat.duration)}
          dealing={beat.id === "deal" || beat.id.startsWith("draw-") || beat.id === "redraw"}
          nodes={nodes}
          reduced={reduced}
        />
      ))}
      {[true, false].flatMap((rival) =>
        Array.from({ length: fixture.handSize }, (_, slot) => (
          <DomCardMotion
            key={`${rival}-${slot}`}
            id={`${rival}-${slot}`}
            shuffling={
              (beat.id === "shuffle" && slot >= (rival ? beat.rivalCount : beat.localCount)) ||
              (beat.id === "reshuffle" && !rival && selected.includes(slot))
            }
            shuffleDuration={beat.duration}
            stackOrder={!rival && inspected === slot ? 60 : 5 + slot}
            liftPx={rival ? 14 : 34}
            flightMs={flightDuration}
            pose={layout.card(slot, rival, beat, selected.includes(slot), inspected)}
            clock={clock}
            motionKey={beat}
            timed={Boolean(beat.duration)}
            dealing={beat.id === "deal" || beat.id.startsWith("draw-") || beat.id === "redraw"}
            nodes={nodes}
            reduced={reduced}
            delay={
              (beat.id === "redraw" ? Math.max(0, selected.indexOf(slot)) : slot) * dealStagger
            }
            onDraw={onDraw}
          />
        )),
      )}
    </>
  );
}
