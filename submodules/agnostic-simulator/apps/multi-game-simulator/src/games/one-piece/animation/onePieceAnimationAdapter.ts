import type { AnimationPlanV1, AnimationRef, AnimationZoneRef } from "@tcg/protocol";
import type { EngineAnimation } from "@tcg/op-engine/practice-st01";
import type { AnimationPlanAdapter } from "@tcg/simulator-runtime/animation-adapter";

const HUMAN_SEAT = "south";

export const onePieceAnimationPlanAdapter: AnimationPlanAdapter<
  readonly EngineAnimation[],
  undefined
> = {
  id: "one-piece-engine-animation-v1",
  toAnimationPlans: (animations) => animations.map(onePieceAnimationToAnimationPlan),
};

export function onePieceAnimationToAnimationPlan(animation: EngineAnimation): AnimationPlanV1 {
  const stepBase = {
    id: `${animation.id}:step`,
    durationMs: animation.duration,
  };

  switch (animation.data.kind) {
    case "cardMove":
      return {
        id: animation.id,
        version: 1,
        anchors: [],
        steps: [
          {
            ...stepBase,
            type: "moveEntity",
            entity: entityRef(animation.data.cardId),
            from: onePieceZoneRef(animation.data.fromOwner, animation.data.fromZone),
            to: onePieceZoneRef(animation.data.toOwner, animation.data.toZone),
            audioCue: onePieceCardMoveAudioCue(animation.data),
          },
        ],
      };
    case "attack":
      return {
        id: animation.id,
        version: 1,
        anchors: [],
        steps: [
          {
            ...stepBase,
            type: "combat",
            source: entityRef(animation.data.attackerId),
            target: entityRef(animation.data.targetId),
            reason: "declared",
            audioCue: "combat.start",
          },
        ],
      };
    case "effect": {
      const source = entityRef(animation.data.sourceInstanceId);
      return {
        id: animation.id,
        version: 1,
        anchors: [],
        steps: [
          {
            ...stepBase,
            type: "effect",
            source,
            targets:
              animation.data.targetIds.length > 0
                ? animation.data.targetIds.map((targetId) => entityRef(targetId))
                : [source],
            label: animation.data.label,
            audioCue: "effect.trigger",
          },
        ],
      };
    }
    case "generic": {
      if (
        animation.data.name === "donAttached" &&
        typeof animation.data.params.targetId === "string"
      ) {
        const target = entityRef(animation.data.params.targetId);
        const amount =
          typeof animation.data.params.amount === "number" ? animation.data.params.amount : 1;
        return {
          id: animation.id,
          version: 1,
          anchors: [],
          steps: [
            {
              ...stepBase,
              type: "effect",
              source: target,
              targets: [target],
              label: `DON +${amount}`,
              audioCue: "resource.gain",
            },
          ],
        };
      }
      throw new Error(`Unsupported One Piece animation data: ${animation.data.name}`);
    }
  }
}

function onePieceCardMoveAudioCue({
  fromZone,
  toZone,
}: Extract<EngineAnimation["data"], { kind: "cardMove" }>): NonNullable<
  AnimationPlanV1["steps"][number]["audioCue"]
> {
  if (fromZone === "deck" && toZone === "hand") return "card.draw";
  if (toZone === "trash") return "card.discard";
  if (fromZone === "hand") return "card.play";
  return "card.move";
}

function entityRef(id: string): Extract<AnimationRef, { kind: "entity" }> {
  return { kind: "entity", id };
}

function onePieceZoneRef(
  owner: Extract<EngineAnimation["data"], { kind: "cardMove" }>["fromOwner"],
  zone: Extract<EngineAnimation["data"], { kind: "cardMove" }>["fromZone"],
): AnimationZoneRef {
  const ownerId = owner === HUMAN_SEAT ? "player" : "opponent";
  return { kind: "zone", id: `${ownerId}-${onePieceZoneSuffix(zone)}`, ownerId };
}

function onePieceZoneSuffix(
  zone: Extract<EngineAnimation["data"], { kind: "cardMove" }>["fromZone"],
): string {
  switch (zone) {
    case "leader":
      return "leader";
    case "deck":
      return "deck";
    case "hand":
      return "hand";
    case "life":
      return "life";
    case "character":
      return "characters";
    case "stage":
      return "stage";
    case "trash":
      return "trash";
    case "resolution":
      return "resolution";
  }
}
