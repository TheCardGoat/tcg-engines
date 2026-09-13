import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hoodwink.generated.ts";

export const hoodwink = definePitchFamily(fabPitchFamilies.hoodwink, {
  abilities: () => ({
    discardCardsToPreventArcane: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "effect", type: "discard-self" },
          {
            class: "effect",
            type: "discard",
            count: { type: "any-number" },
          },
        ],
      },
      effect: {
        type: "prevention",
        preventionKind: "shielding",
        damageType: "arcane",
        amount: {
          type: "sum",
          operands: [
            3,
            {
              type: "count",
              what: "discarded-this-way",
              property: "defense",
            },
          ],
        },
        shielded: { selector: "controller" },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: hoodwinkBlue } = hoodwink.cards;
