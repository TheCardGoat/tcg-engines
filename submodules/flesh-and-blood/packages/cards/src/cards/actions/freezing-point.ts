import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/freezing-point.generated.ts";

export const freezingPoint = definePitchFamily(fabPitchFamilies["freezing-point"], {
  keywords: [fusion("Ice")],
  abilities: () => ({
    deal5ArcaneDamageTargetHeroIfFreezingPoint: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "has-status",
          status: "fused",
        },
        then: {
          type: "deal-damage",
          damageType: "arcane",
          amount: {
            type: "sum",
            operands: [
              5,
              {
                type: "count",
                what: "cards-in-zone",
                zone: "permanent",
                player: "target-controller",
                filter: { name: "Frostbite" },
              },
              {
                type: "count",
                what: "cards-in-zone",
                zone: "permanent",
                player: "target-controller",
                filter: {
                  typeBox: {
                    supertypes: ["Ice"],
                    subtypes: ["Affliction"],
                  },
                },
              },
              {
                type: "count",
                what: "cards-in-zone",
                zone: "permanent",
                player: "target-controller",
                filter: {
                  hasStatus: "frozen",
                },
              },
            ],
          },
          target: { selector: "any-hero" },
        },
        else: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 5,
          target: { selector: "any-hero" },
        },
      },
    },
  }),
});
export const { red: freezingPointRed } = freezingPoint.cards;
