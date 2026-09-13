import { bloodDebt, goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ram-raider.generated.ts";

export const ramRaider = definePitchFamily(fabPitchFamilies["ram-raider"], {
  keywords: [bloodDebt],

  abilities: () => ({
    playBanish: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: 1,
          random: true,
        },
      },
    },
    compareAmountCountGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "banished-this-way",
          filter: { power: { op: "gte", value: 6 } },
        },
        comparison: { op: "gte", value: 1 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: ramRaiderRed, yellow: ramRaiderYellow, blue: ramRaiderBlue } = ramRaider.cards;
