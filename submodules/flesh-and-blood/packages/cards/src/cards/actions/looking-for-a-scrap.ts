import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/looking-for-a-scrap.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const lookingForAScrap = definePitchFamily(fabPitchFamilies["looking-for-a-scrap"], {
  keywords: [goAgain],
  abilities: () => ({
    playBanishSequenceModifyNumericPowerPermanentGrantPropertyPermanent: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 1,
          filter: {
            power: {
              op: "eq",
              value: 1,
            },
          },
        },
        optional: true,
        then: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: lookingForAScrapRed,
  yellow: lookingForAScrapYellow,
  blue: lookingForAScrapBlue,
} = lookingForAScrap.cards;
