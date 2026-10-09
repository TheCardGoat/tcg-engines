import {
  nextTargetedBeat,
  resolutionFocusPose,
} from "@tcg/simulator-presentation/targeted-resolution";
import type { DomCardPose } from "@tcg/simulator-presentation/dom";
import { cardSelection } from "@tcg/simulator-presentation";
export type PlayKind = "clash" | "basic" | "quick";
export type PlayPhase =
  | "idle"
  | "flight"
  | "standby"
  | "disclose"
  | "targets"
  | "resolve"
  | "outcome"
  | "discard"
  | "enter"
  | "complete"
  | "return";
export const playCards = {
  clash: {
    name: "Captain Maxine Riggins",
    product: 534928,
    type: "Clash card",
    window: "Your Primary Phase",
    effect: "Enter the Clash Zone ready.",
  },
  basic: {
    name: "Deliverance",
    product: 535400,
    type: "Basic Action",
    window: "Your Primary Phase",
    effect: "Send target Clash card to Oblivion.",
  },
  quick: {
    name: "Piercing Strike",
    product: 535066,
    type: "Quick Action",
    window: "Counter–Attack window",
    effect: "Deal two damage to target attacking Clash card.",
  },
} as const;
export const playPose = (x: number, y: number, width = 110, rotation = 0): DomCardPose => ({
  left: x - width / 2,
  top: y - width * 0.7,
  width,
  height: width * 1.4,
  rotation,
  face: true,
});
export const playSlots = {
  hand: playPose(570, 550, 125),
  focus: resolutionFocusPose(),
  standby: playPose(540, 265, 170),
  field: playPose(710, 440, 110),
  enemyA: playPose(635, 220, 125),
  enemyB: playPose(825, 220, 100),
  discard: playPose(1080, 525, 80),
  enemyDiscard: playPose(1190, 85, 65),
};
export function nextPlayPhase(kind: PlayKind, phase: PlayPhase): PlayPhase {
  if (phase === "flight") return "standby";
  if (phase === "standby" && kind === "clash") return "enter";
  const next = nextTargetedBeat(phase);
  if (next) return next;
  if (phase === "targets") return "discard";
  if (phase === "discard" || phase === "enter") return "complete";
  return "idle";
}
export function playTargetPose(
  kind: PlayKind,
  phase: PlayPhase,
  selected: boolean,
  alternate = false,
): DomCardPose {
  const normal = alternate ? playSlots.enemyB : playSlots.enemyA;
  if (kind === "basic" && selected && ["targets", "discard", "complete"].includes(phase))
    return playSlots.enemyDiscard;
  const highlighted =
    kind !== "clash" && selected && ["idle", "disclose", "resolve", "outcome"].includes(phase);
  const width = normal.width * (highlighted ? cardSelection.scale : 1);
  const height = normal.height * (highlighted ? cardSelection.scale : 1);
  return {
    ...normal,
    left: normal.left - (width - normal.width) / 2,
    top: normal.top - (height - normal.height) / 2 - (highlighted ? cardSelection.lift : 0),
    width,
    height,
    rotation: kind === "quick" && !alternate ? -Math.PI / 2 : 0,
  };
}

/** A stationary invalid release needs no return animation or landing callback. */
export function releasedPlayPhase(pose: DomCardPose, valid: boolean): PlayPhase {
  if (valid) return "flight";
  return Math.abs(pose.left - playSlots.hand.left) > 0.1 ||
    Math.abs(pose.top - playSlots.hand.top) > 0.1
    ? "return"
    : "idle";
}
