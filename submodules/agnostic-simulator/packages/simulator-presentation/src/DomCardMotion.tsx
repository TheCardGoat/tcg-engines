import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, type MutableRefObject } from "react";
import { resolveCardTransferPose, type CardTransferRect } from "./motion";
import type { CardReaction } from "./resolution-motion";
export interface DomCardPose extends CardTransferRect {
  rotation: number;
  face: boolean;
}

export function DomCardMotion({
  id,
  pose,
  clock,
  motionKey,
  timed,
  dealing,
  shuffling = false,
  shuffleDuration = 800,
  nodes,
  reduced,
  delay = 0,
  role = "card",
  stackOrder = 5,
  restingElevation = 0,
  flightMs = 720,
  liftPx = 34,
  onDraw,
  onLaunch,
  onLand,
  handoff,
  dragPose,
  reaction,
}: {
  id: string;
  pose: DomCardPose;
  clock: MutableRefObject<number>;
  motionKey: unknown;
  timed: boolean;
  dealing: boolean;
  shuffling?: boolean;
  shuffleDuration?: number;
  nodes: { readonly current: Map<string, HTMLDivElement> };
  reduced: boolean;
  delay?: number;
  role?: "card" | "leader" | "deck";
  stackOrder?: number;
  restingElevation?: number;
  flightMs?: number;
  liftPx?: number;
  onDraw?: () => void;
  onLaunch?: () => void;
  onLand?: () => void;
  handoff?: { key: unknown; pose: DomCardPose };
  dragPose?: MutableRefObject<DomCardPose | undefined>;
  reaction?: MutableRefObject<CardReaction>;
}) {
  const { invalidate } = useThree();
  const current = useRef(pose);
  const from = useRef(pose);
  const started = useRef(0);
  const lastBeat = useRef(motionKey);
  const elevation = useRef(0);
  const fromElevation = useRef(0);
  const sounded = useRef(false);
  const drawing = useRef(false);
  const moving = useRef(false);
  const landed = useRef(true);
  const launched = useRef(false);
  const lastHandoff = useRef<unknown>(undefined);
  const callbacks = useRef({ onLaunch, onLand });
  callbacks.current = { onLaunch, onLand };
  useLayoutEffect(() => {
    if (handoff && lastHandoff.current !== handoff.key) {
      current.current = handoff.pose;
      lastHandoff.current = handoff.key;
    }
    from.current = current.current;
    fromElevation.current = elevation.current;
    // Raster layout stays fixed throughout a flight; the compositor scales it.
    const node = nodes.current.get(id);
    if (node) {
      node.style.width = `${pose.width}px`;
      node.style.height = `${pose.height}px`;
    }
    moving.current =
      Math.abs(pose.left - current.current.left) > 0.1 ||
      Math.abs(pose.top - current.current.top) > 0.1 ||
      Math.abs(pose.width - current.current.width) > 0.1 ||
      Math.abs(pose.rotation - current.current.rotation) > 0.001 ||
      pose.face !== current.current.face;
    const changedBeat = lastBeat.current !== motionKey;
    lastBeat.current = motionKey;
    drawing.current =
      changedBeat && role === "card" && dealing && Math.abs(pose.left - from.current.left) > 5;
    // Parent and child layout effects can run in either commit order. Every
    // new beat uses its own zero origin; retargets within a beat use its clock.
    started.current = (changedBeat ? 0 : clock.current) + (drawing.current && !reduced ? delay : 0);
    sounded.current = false;
    landed.current = !moving.current;
    launched.current = false;
    invalidate();
  }, [
    handoff,
    pose.left,
    pose.top,
    pose.width,
    pose.face,
    pose.rotation,
    motionKey,
    timed,
    dealing,
    shuffling,
    shuffleDuration,
    reduced,
    delay,
    id,
    role,
    clock,
    invalidate,
  ]);
  useFrame(() => {
    const node = nodes.current.get(id);
    if (!node || document.hidden) return;
    if (dragPose?.current) {
      const held = dragPose.current;
      current.current = held;
      node.style.width = `${held.width}px`;
      node.style.height = `${held.height}px`;
      node.style.transform = `translate3d(${held.left}px,${held.top}px,0) rotateZ(${held.rotation}rad)`;
      node.style.zIndex = "90";
      node.dataset.face = String(held.face);
      elevation.current = 0.65;
      node.style.setProperty("--flight-elevation", "0.65");
      return;
    }
    const duration = reduced ? 1 : !timed ? 200 : role === "leader" ? 820 : flightMs;
    const distance = Math.hypot(pose.left - from.current.left, pose.top - from.current.top);
    const motion = resolveCardTransferPose({
      source: from.current,
      destination: pose,
      elapsedMs: moving.current ? clock.current : started.current + duration,
      startAtMs: started.current,
      durationMs: duration,
      faceChanges: from.current.face !== pose.face,
      sourceVisible: true,
      destinationVisible: true,
      holdsAtSource: true,
      choreography: {
        liftPx: !timed ? 0 : Math.min(liftPx, distance * 0.055),
        revealStart: drawing.current ? 0.34 : 0.18,
        revealDuration: drawing.current ? 0.46 : 0.5,
      },
    });
    const progress = motion.progress;
    const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
    const shuffle =
      !reduced && shuffling
        ? Math.sin(Math.min(1, clock.current / Math.max(1, shuffleDuration)) * Math.PI) ** 2 *
          Math.sin(Math.min(1, clock.current / Math.max(1, shuffleDuration)) * Math.PI * 4)
        : 0;
    const x = motion.centerX + shuffle * 9;
    const y = motion.centerY - Math.abs(shuffle) * 2;
    const rotation =
      from.current.rotation + (pose.rotation - from.current.rotation) * eased + shuffle * 0.025;
    const visibleFace =
      from.current.face === pose.face
        ? pose.face
        : motion.faceRevealed
          ? pose.face
          : from.current.face;
    current.current = {
      left: x - motion.width / 2,
      top: y - motion.height / 2,
      width: motion.width,
      height: motion.height,
      rotation,
      face: visibleFace,
    };
    const response = reaction?.current;
    node.style.opacity = String(response?.opacity ?? 1);
    node.style.transform = `translate3d(${x - pose.width / 2 + (response?.x ?? 0)}px,${y - pose.height / 2 + (response?.y ?? 0)}px,0) rotateY(${motion.rotationY}rad) rotateZ(${rotation + motion.rotationZ}rad) scale(${(motion.width / pose.width) * (response?.scale ?? 1)})`;
    node.style.zIndex = String(
      progress > 0 && progress < 1
        ? 40 + Math.round(progress * 20)
        : node.dataset.selected === "true"
          ? 30
          : role === "leader"
            ? 3
            : role === "deck"
              ? 1
              : stackOrder,
    );
    node.dataset.face = String(visibleFace);
    // Two pre-painted shadow layers crossfade on the compositor. No animated
    // blur or shadow-map pass, and the shadow turns edge-on with the artwork.
    const settledElevation = Math.max(
      restingElevation,
      node.dataset.selected === "true" ? 0.22 : 0,
    );
    // Preserve the held shadow on release and blend it into the flight. Short
    // selection moves stay close to the table instead of casting a flight shadow.
    const travelElevation = timed ? Math.min(1, distance / 240) : 0;
    elevation.current = reduced
      ? settledElevation
      : fromElevation.current * (1 - eased) +
        settledElevation * eased +
        (moving.current ? (motion.depth / 72) * travelElevation : 0);
    node.style.setProperty("--flight-elevation", String(Math.min(1, elevation.current)));
    if (drawing.current && !sounded.current && clock.current >= started.current) {
      sounded.current = true;
      onDraw?.();
    }
    if (moving.current && !launched.current && clock.current >= started.current) {
      launched.current = true;
      callbacks.current.onLaunch?.();
    }
    if (moving.current && !landed.current && progress >= 1) {
      landed.current = true;
      callbacks.current.onLand?.();
    }
    if (progress < 1) invalidate();
  });
  return null;
}
