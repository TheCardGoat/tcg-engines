import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { DomCardMotion, type DomCardPose } from "./DomCardMotion";

export interface CardSequenceStep {
  readonly duration: number;
  readonly poses: Readonly<Record<string, DomCardPose>>;
  readonly flightMs?: number;
}
/** One clock for a game-provided pose step. No engine state or per-frame React updates. */
export function CardSequence({
  step,
  nodes,
  reduced = false,
  onDone,
  onSample,
  onCardLaunch,
  onCardLand,
}: {
  step: CardSequenceStep;
  nodes: { current: Map<string, HTMLDivElement> };
  reduced?: boolean;
  onDone: () => void;
  onSample?: (milliseconds: number) => void;
  onCardLaunch?: (id: string) => void;
  onCardLand?: (id: string) => void;
}) {
  const clock = useRef(0);
  const done = useRef(false);
  useLayoutEffect(() => {
    clock.current = 0;
    done.current = false;
  }, [step]);
  useFrame((_, delta) => {
    if (document.hidden || done.current) return;
    clock.current += Math.min(delta * 1000, 50);
    onSample?.(delta * 1000);
    if (clock.current >= (reduced ? 140 : step.duration)) {
      done.current = true;
      onDone();
    }
  }, -1);
  return Object.entries(step.poses).map(([id, pose]) => (
    <DomCardMotion
      key={id}
      id={id}
      pose={pose}
      clock={clock}
      motionKey={step}
      timed
      dealing={false}
      nodes={nodes}
      reduced={reduced}
      flightMs={step.flightMs ?? 720}
      onLaunch={() => onCardLaunch?.(id)}
      onLand={() => onCardLand?.(id)}
      stackOrder={id === "subject" ? 12 : 4}
    />
  ));
}
