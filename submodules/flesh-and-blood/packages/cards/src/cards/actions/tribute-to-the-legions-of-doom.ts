import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tribute-to-the-legions-of-doom.generated.ts";

export const tributeToTheLegionsOfDoom = definePitchFamily(
  fabPitchFamilies["tribute-to-the-legions-of-doom"],
  {
    keywords: [bloodDebt],

    abilities: () => ({
      banishTopCardAsAdditionalCost: {
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
      gainPowerIfSixPowerCardBanished: {
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    }),
  },
);
export const {
  red: tributeToTheLegionsOfDoomRed,
  yellow: tributeToTheLegionsOfDoomYellow,
  blue: tributeToTheLegionsOfDoomBlue,
} = tributeToTheLegionsOfDoom.cards;
