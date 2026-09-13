import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/voltbound-duality.generated.ts";

export const voltboundDuality = definePitchFamily(fabPitchFamilies["voltbound-duality"], {
  abilities: () => ({
    activatedSequence: {
      kind: "activated",
      abilityType: "instant",
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
            type: "discard-self",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "any-hero",
            },
          },
          {
            type: "create-token",
            token: "lightning-flow",
            controller: "controller",
          },
        ],
      },
    },
  }),
});

export const {
  red: voltboundDualityRed,
  yellow: voltboundDualityYellow,
  blue: voltboundDualityBlue,
} = voltboundDuality.cards;
