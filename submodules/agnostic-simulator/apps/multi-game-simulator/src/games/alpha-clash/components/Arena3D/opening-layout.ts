import type { OpeningBeat } from "@tcg/simulator-presentation/opening";
import { inspectionSpreadPose } from "@tcg/simulator-presentation/inspection-pose";
import type { Camera } from "three";
import { CARD_RATIO, type PlacedCard } from "./layout";

/** Adapt the shared opening beats to the actual arena's world coordinates. */
export function openingPlacement(
  card: PlacedCard,
  beat: OpeningBeat,
  rival: boolean,
  slot: number,
  count: number,
  compact: boolean,
  view: { camera: Camera; viewportAspect: number },
): PlacedCard {
  if (card.card.zone === "contender") {
    if (beat.leaders !== "showcase") return card;
    const pose = inspectionSpreadPose(view.camera, {
      distance: view.camera.position.length() * 0.68,
      aspect: CARD_RATIO,
      viewportAspect: view.viewportAspect,
      heightFraction: 0.72,
      widthFraction: 0.9,
      count: 2,
      index: rival ? 1 : 0,
      columns: 2,
      gapFraction: 0.12,
    });
    return {
      ...card,
      x: pose.x,
      y: pose.y,
      z: pose.z,
      height: pose.scale / CARD_RATIO,
      angle: 0,
      rotationX: pose.rotationX,
    };
  }
  if (!card.hand) return card;
  const inDeck = rival
    ? beat.rivalCount === 0
    : beat.localCount === 0 || beat.hand === "return" || beat.hand === "deck";
  if (inDeck)
    return {
      ...card,
      x: 650,
      y: (rival ? 1 : -1) * (compact ? 320 : 365),
      z: 22 + slot * 0.3,
      height: 90,
      angle: 0,
    };
  if (!rival && beat.hand === "review") {
    const pose = inspectionSpreadPose(view.camera, {
      distance: view.camera.position.length() * 0.68,
      aspect: CARD_RATIO,
      viewportAspect: view.viewportAspect,
      heightFraction: 0.62,
      widthFraction: 0.9,
      count,
      index: slot,
      columns: view.viewportAspect > 2 ? count : Math.ceil(count / 2),
    });
    return {
      ...card,
      x: pose.x,
      y: pose.y,
      z: pose.z,
      height: pose.scale / CARD_RATIO,
      angle: 0,
      rotationX: pose.rotationX,
    };
  }
  return card;
}
