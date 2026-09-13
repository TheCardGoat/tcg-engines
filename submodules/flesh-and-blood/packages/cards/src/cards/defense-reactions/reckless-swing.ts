import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/reckless-swing.generated.ts";

export const recklessSwing = definePitchFamily(fabPitchFamilies["reckless-swing"], {
  abilities: () => ({
    discardRandomCardAsCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          random: true,
        },
      },
    },
    damageOnHighPowerDiscard: {
      kind: "resolution",
      condition: {
        type: "binding-matches",
        binding: "discardedCard",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
        },
      },
      effect: {
        type: "deal-damage",
        damageType: "generic",
        amount: 2,
        target: {
          selector: "attacking-hero",
        },
      },
    },
  }),
});

export const { blue: recklessSwingBlue } = recklessSwing.cards;
