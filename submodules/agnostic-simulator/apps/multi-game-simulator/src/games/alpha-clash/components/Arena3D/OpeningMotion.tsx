import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { resolveCardTransferPose } from "@tcg/simulator-presentation/motion";
import { dealStagger, flightDuration } from "@tcg/simulator-presentation/opening";
import type { ArenaOpening } from "./useArenaOpening";
import { openingPlacement } from "./opening-layout";
import { CARD_RATIO, type PlacedCard } from "./layout";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";

const MotionContext = createContext<{ opening: ArenaOpening; clock: RefObject<number> } | null>(
  null,
);
export function useHasOpeningMotion() {
  return Boolean(useContext(MotionContext)?.opening.beat.duration);
}
export function useRestingOpeningPlacement(
  placed: PlacedCard,
  rival: boolean,
  slot: number,
  count: number,
  compact: boolean,
) {
  const opening = useContext(MotionContext)?.opening;
  const beat = opening?.beat;
  const retained =
    opening?.retainedIds.has(placed.card.instanceId) &&
    ["return", "reshuffle", "redraw"].includes(beat?.id ?? "");
  const { camera, size } = useThree();
  return beat?.id === "hand" || retained
    ? openingPlacement(
        placed,
        { ...beat!, hand: "review", localCount: count },
        rival,
        slot,
        count,
        compact,
        {
          camera,
          viewportAspect: size.width / size.height,
        },
      )
    : placed;
}
export function OpeningMotion({
  opening,
  reduced,
  sound,
  paused = false,
  children,
}: {
  opening?: ArenaOpening;
  reduced: boolean;
  sound?: boolean;
  paused?: boolean;
  children: ReactNode;
}) {
  const clock = useRef(0);
  const done = useRef(false);
  const lastDraw = useRef(-1);
  const invalidate = useThree((state) => state.invalidate);
  const beat = opening?.beat;
  useEffect(() => {
    const resume = () => invalidate();
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [invalidate]);
  useLayoutEffect(() => {
    clock.current = 0;
    done.current = false;
    lastDraw.current = -1;
    invalidate();
  }, [beat, invalidate]);
  useEffect(() => {
    if (!paused) invalidate();
  }, [paused, invalidate]);
  useFrame((_, delta) => {
    if (!beat?.duration || done.current || document.hidden || paused) return;
    clock.current += Math.min(delta * 1000, 50);
    const draw = Math.min(7, Math.floor(clock.current / dealStagger));
    if ((beat.id === "deal" || beat.id === "redraw") && draw > lastDraw.current) {
      lastDraw.current = draw;
      if (sound && !reduced) playSimulatorSound("card.draw");
    }
    if (clock.current >= (reduced ? 80 : beat.duration)) {
      done.current = true;
      opening?.advance(beat.id);
    }
    invalidate();
  }, -2);
  return (
    <MotionContext.Provider value={opening ? { opening, clock } : null}>
      {children}
    </MotionContext.Provider>
  );
}

/** Uses the same flight sampler and stagger as the shared opening preview, in world space. */
export function useOpeningCardMotion(
  ref: RefObject<Group | null>,
  placed: PlacedCard,
  rival: boolean,
  slot: number,
  count: number,
  compact: boolean,
  horizontalScale: number,
  reduced: boolean,
) {
  const context = useContext(MotionContext);
  const beat = context?.opening.beat;
  const replacement = !!beat && ["return", "reshuffle", "redraw"].includes(beat.id);
  // Replacement choreography belongs only to the local outgoing/incoming cards.
  // A zero-distance flight still has lift and tilt, so other cards must not sample it.
  const stationary =
    (replacement &&
      (!placed.hand || rival || context?.opening.retainedIds.has(placed.card.instanceId))) ||
    (beat?.id === "settle" && (!placed.hand || rival));
  const source = useRef({ x: 0, y: 0, z: 0, scale: 1, turn: 0, tilt: 0, flip: 0, face: false });
  const face = useRef(false);
  // The resting-pose hook can update the group before this layout effect.
  // Preserve the last rendered pose so each opening flight starts on screen.
  const renderedPose = useRef<typeof source.current | null>(null);
  const restoreStationaryPose = (group: Group) => {
    const pose = renderedPose.current;
    if (!pose) return;
    group.position.set(pose.x, pose.y, pose.z);
    group.scale.setScalar(pose.scale);
    group.rotation.set(pose.tilt, pose.flip, pose.turn);
  };
  const { camera, size } = useThree();
  const target = beat
    ? openingPlacement(placed, beat, rival, slot, count, compact, {
        camera,
        viewportAspect: size.width / size.height,
      })
    : placed;
  const atDeck =
    placed.hand &&
    Boolean(
      beat &&
      (rival
        ? beat.rivalCount === 0
        : beat.localCount === 0 || beat.hand === "deck" || beat.hand === "return"),
    );
  const targetFace = !atDeck && !placed.card.faceDown;
  const targetX =
    target.x *
    (atDeck || (placed.card.zone === "contender" && beat?.leaders !== "showcase")
      ? horizontalScale
      : 1);
  const initialized = useRef(false);
  useLayoutEffect(() => {
    const group = ref.current;
    if (!group || !beat) return;
    if (stationary) {
      restoreStationaryPose(group);
      return;
    }
    if (!initialized.current) {
      // Cards arriving after a native mulligan start from the deck, never flash in the hand.
      const fromDeck = placed.hand && beat.id === "redraw";
      group.position.set(
        fromDeck ? 650 * horizontalScale : targetX,
        fromDeck ? -(compact ? 320 : 365) : target.y,
        target.z,
      );
      group.scale.setScalar((fromDeck ? 90 : target.height) * CARD_RATIO);
      group.rotation.z = target.angle;
      face.current = fromDeck ? false : targetFace;
      initialized.current = true;
    }
    source.current = renderedPose.current ?? {
      x: group.position.x,
      y: group.position.y,
      z: group.position.z,
      scale: group.scale.x,
      turn: group.rotation.z,
      tilt: group.rotation.x,
      flip: group.rotation.y,
      face: face.current,
    };
    // Native acceptance can briefly mount the new hand before its animation.
    // Use opening slots and the deck as authoritative presentation origins.
    if (
      placed.hand &&
      !rival &&
      !context?.opening.retainedIds.has(placed.card.instanceId) &&
      (beat.id === "return" || beat.id === "redraw")
    ) {
      const origin = openingPlacement(
        placed,
        { ...beat, hand: beat.id === "return" ? "review" : "deck" },
        rival,
        slot,
        count,
        compact,
        { camera, viewportAspect: size.width / size.height },
      );
      source.current = {
        x: origin.x * (beat.id === "redraw" ? horizontalScale : 1),
        y: origin.y,
        z: origin.z,
        scale: origin.height * CARD_RATIO,
        turn: origin.angle,
        tilt: origin.rotationX ?? 0,
        flip: beat.id === "return" ? 0 : Math.PI,
        face: beat.id === "return" && !placed.card.faceDown,
      };
      // Set the first frame before paint; the frame loop then advances the flight.
      const start = source.current;
      group.position.set(start.x, start.y, start.z);
      group.scale.setScalar(start.scale);
      group.rotation.set(start.tilt, start.face ? 0 : Math.PI, start.turn);
    }
    face.current = targetFace;
    group.visible = placed.card.zone !== "contender" || beat.leaders !== "hidden";
  }, [
    beat,
    stationary,
    ref,
    compact,
    horizontalScale,
    targetX,
    target.y,
    target.z,
    target.height,
    target.angle,
    targetFace,
    placed.hand,
    placed.card.zone,
  ]);
  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    if (stationary) {
      restoreStationaryPose(group);
      return;
    }
    if (
      !beat ||
      !context ||
      beat.id === "hand" ||
      (context.opening.retainedIds.has(placed.card.instanceId) &&
        ["return", "reshuffle", "redraw"].includes(beat.id))
    ) {
      group.visible = true;
      group.rotation.y = 0;
      renderedPose.current = {
        x: group.position.x,
        y: group.position.y,
        z: group.position.z,
        scale: group.scale.x,
        turn: group.rotation.z,
        tilt: group.rotation.x,
        flip: group.rotation.y,
        face: !placed.card.faceDown,
      };
      return;
    }
    const start = source.current;
    const elapsed = reduced || !beat.duration ? 10000 : context.clock.current;
    const delay =
      placed.hand && (beat.id === "deal" || beat.id === "redraw") ? slot * dealStagger : 0;
    const width = target.height * CARD_RATIO;
    const pose = resolveCardTransferPose({
      source: {
        left: start.x - start.scale / 2,
        top: -start.y - start.scale / CARD_RATIO / 2,
        width: start.scale,
        height: start.scale / CARD_RATIO,
      },
      destination: {
        left: targetX - width / 2,
        top: -target.y - target.height / 2,
        width,
        height: target.height,
      },
      elapsedMs: elapsed,
      startAtMs: delay,
      durationMs: flightDuration,
      sourceVisible: true,
      destinationVisible: true,
      faceChanges: start.face !== targetFace,
      choreography: { liftPx: reduced ? 0 : 28, revealStart: 0.25, revealDuration: 0.5 },
    });
    group.position.set(pose.centerX, -pose.centerY, start.z + (target.z - start.z) * pose.progress);
    group.scale.setScalar(pose.width);
    group.rotation.z = start.turn + (target.angle - start.turn) * pose.progress;
    group.rotation.x = start.tilt + ((target.rotationX ?? 0) - start.tilt) * pose.progress;
    const p = Math.min(1, Math.max(0, (pose.progress - 0.25) / 0.5));
    group.rotation.y =
      start.face === targetFace ? (targetFace ? 0 : Math.PI) : Math.PI * (targetFace ? 1 - p : p);
    if (beat.id === "shuffle" || (beat.id === "reshuffle" && !rival)) {
      if (atDeck && !reduced)
        group.position.x +=
          Math.sin(context.clock.current / 70 + slot) *
          12 *
          Math.sin(Math.PI * Math.min(1, context.clock.current / (beat.duration ?? 1)));
    }
    renderedPose.current = {
      x: group.position.x,
      y: group.position.y,
      z: group.position.z,
      scale: group.scale.x,
      turn: group.rotation.z,
      tilt: group.rotation.x,
      flip: group.rotation.y,
      face: targetFace,
    };
  });
}
