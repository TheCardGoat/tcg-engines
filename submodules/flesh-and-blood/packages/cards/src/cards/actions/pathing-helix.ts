import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pathing-helix.generated.ts";

const abilities = {
  triggeredHitZoneCountOptionalMoveCard: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
      event: {
        name: "hit",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "attack",
        },
      },
      state: {
        type: "zone-count",
        zone: "arsenal",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: 1,
          },
          to: {
            zone: "arsenal",
          },
          faceDown: true,
        },
      },
    },
  },
} as const;

export const pathingHelix = definePitchFamily(fabPitchFamilies["pathing-helix"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: pathingHelixRed,
  yellow: pathingHelixYellow,
  blue: pathingHelixBlue,
} = pathingHelix.cards;
