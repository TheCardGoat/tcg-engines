import { AnimationPlanV2Schema, type AnimationPlanV2, type AnimationStepV2 } from "@tcg/protocol";
import type { GameAnimationAdapter } from "@tcg/simulator-runtime/animation";

import type {
  RiftboundClientCardV1,
  RiftboundClientMatchActionV1,
  RiftboundClientMatchStateV1,
  RiftboundZone,
} from "./state";

export const riftboundAnimationAdapter: GameAnimationAdapter<
  RiftboundClientMatchStateV1,
  RiftboundClientMatchActionV1
> = {
  toAnimationPlan({ fromState, toState, animations, viewerId, transitionId }) {
    const action = animations.at(-1);
    if (!action) return null;
    return riftboundActionToAnimationPlan({
      fromState,
      toState,
      action,
      viewerId,
      transitionId,
    });
  },
};

export function riftboundActionToAnimationPlan(input: {
  readonly fromState: RiftboundClientMatchStateV1;
  readonly toState: RiftboundClientMatchStateV1;
  readonly action: RiftboundClientMatchActionV1;
  readonly viewerId: string | null;
  readonly transitionId: string;
}): AnimationPlanV2 | null {
  const { fromState, toState, action, viewerId, transitionId } = input;
  const steps: AnimationStepV2[] = [];
  const base = { id: `${transitionId}:${action.type}` };

  switch (action.type) {
    case "move_card": {
      const before = fromState.cards[action.cardId];
      const after = toState.cards[action.cardId];
      if (!before || !after) break;
      steps.push({
        ...base,
        type: "entityTransfer",
        entity: entityRef(action.cardId),
        from: zoneRef(before.ownerId, before.zone),
        to: zoneRef(after.ownerId, after.zone),
        sourceFace: faceFor(before, viewerId),
        destinationFace: faceFor(after, viewerId),
        audioCue: after.zone === "discard" ? "card.discard" : "card.move",
      });
      break;
    }
    case "draw": {
      const drawn = Object.values(toState.cards).filter((card) => {
        const previous = fromState.cards[card.id];
        return card.ownerId === action.ownerId && previous?.zone === "deck" && card.zone === "hand";
      });
      drawn.forEach((card, index) => {
        steps.push({
          id: `${base.id}:${card.id}`,
          type: "entityTransfer",
          entity: entityRef(card.id),
          from: zoneRef(card.ownerId, "deck"),
          to: zoneRef(card.ownerId, "hand"),
          sourceFace: "hidden",
          destinationFace: faceFor(card, viewerId),
          startAtMs: index * 70,
          audioCue: "card.draw",
        });
      });
      break;
    }
    case "set_face": {
      const before = fromState.cards[action.cardId];
      const after = toState.cards[action.cardId];
      if (!before || !after || before.face === after.face) break;
      steps.push({
        ...base,
        type: "entityStateChange",
        entity: entityRef(action.cardId),
        at: entityRef(action.cardId),
        change: "face",
        sourceFace: faceFor(before, viewerId),
        destinationFace: faceFor(after, viewerId),
        audioCue: "effect.trigger",
      });
      break;
    }
    case "rotate": {
      const before = fromState.cards[action.cardId];
      const after = toState.cards[action.cardId];
      if (!before || !after || before.rotation === after.rotation) break;
      steps.push({
        ...base,
        type: "entityStateChange",
        entity: entityRef(action.cardId),
        at: entityRef(action.cardId),
        change: "orientation",
        sourceFace: faceFor(before, viewerId),
        destinationFace: faceFor(after, viewerId),
        fromRotationDeg: before.rotation,
        toRotationDeg: after.rotation,
      });
      break;
    }
    case "set_counter": {
      const before = fromState.cards[action.cardId]?.counters[action.counter] ?? 0;
      const after = toState.cards[action.cardId]?.counters[action.counter] ?? 0;
      if (before === after) break;
      steps.push({
        ...base,
        type: "valueDelta",
        subject: entityRef(action.cardId),
        delta: after - before,
        label: action.counter,
        fromValue: before,
        toValue: after,
        tone: "neutral",
      });
      break;
    }
    case "shuffle":
      steps.push({
        ...base,
        type: "randomization",
        at: zoneRef(action.ownerId, action.zone),
        kind: "shuffle",
        audioCue: "deck.shuffle",
      });
      break;
    case "end_game":
      steps.push({
        ...base,
        type: "gameResult",
        outcome: action.winnerId ? "winner" : "draw",
        ...(action.winnerId ? { winner: playerRef(action.winnerId) } : {}),
        reasonLabel: action.reason,
      });
      break;
    case "publish_statement":
    case "withdraw_statement":
    case "acknowledge_statement":
    case "spotlight_statement":
      break;
  }

  return steps.length > 0
    ? AnimationPlanV2Schema.parse({ id: transitionId, version: 2, steps })
    : null;
}

function faceFor(card: RiftboundClientCardV1, viewerId: string | null): "public" | "hidden" {
  if (card.face === "down" || card.zone === "deck" || card.zone === "runes") return "hidden";
  if (card.zone === "hand" && card.ownerId !== viewerId) return "hidden";
  return "public";
}

function entityRef(id: string) {
  return { kind: "entity" as const, id };
}

function playerRef(id: string) {
  return { kind: "player" as const, id };
}

function zoneRef(ownerId: string, zone: RiftboundZone) {
  const renderedOwnerId = zone === "play" ? "shared" : ownerId;
  return {
    kind: "zone" as const,
    id: `${renderedOwnerId}:${zone}`,
    ownerId: renderedOwnerId,
  };
}
