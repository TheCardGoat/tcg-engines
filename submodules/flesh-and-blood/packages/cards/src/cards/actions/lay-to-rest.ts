import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lay-to-rest.generated.ts";

const abilities = {
  triggeredAttackModifyNumericPowerThisTurn: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "attack",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "event-object",
          selector: "attack",
          relationship: {
            kind: "any",
          },
          filter: {
            typeBox: {
              supertypes: ["Shadow"],
            },
          },
        },
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
  triggeredHitOptionalTurnFaceDown: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
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
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "optional",
        effect: {
          type: "turn-face-down",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["banished"],
            count: 1,
          },
        },
      },
    },
  },
} as const;

export const layToRest = definePitchFamily(fabPitchFamilies["lay-to-rest"], {
  abilities: () => ({ ...abilities }),
});

export const { red: layToRestRed, yellow: layToRestYellow, blue: layToRestBlue } = layToRest.cards;
