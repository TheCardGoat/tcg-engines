import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadow-of-ursur.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const shadowOfUrsur = definePitchFamily(fabPitchFamilies["shadow-of-ursur"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playShadowUrsurFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    asAdditionalCostPlayShadowUrsurBanishWithBloodDebtFromHand: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: 1,
          filter: {
            hasKeyword: "blood-debt",
          },
        },
        optional: true,
        then: {
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
    },
  }),
});

export const { blue: shadowOfUrsurBlue } = shadowOfUrsur.cards;
