import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sawbones-dock-hand.generated.ts";
import { wateryGrave } from "../shared/keywords.ts";

export const sawbonesDockHand = definePitchFamily(fabPitchFamilies["sawbones-dock-hand"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionResourceTAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    instantTNextTimePirateControlWouldDealtDamageTurnPreventNumber1: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hero", "permanent"],
          filter: {
            or: [
              {
                typeBox: {
                  types: ["Hero"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Pirate"],
                },
              },
            ],
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: sawbonesDockHandYellow } = sawbonesDockHand.cards;
