import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spirit-of-christmas.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const spiritOfChristmas = definePitchFamily(fabPitchFamilies["spirit-of-christmas"], {
  keywords: [goAgain],
  abilities: () => ({
    eachHeroChoosesAnotherHeroChosenHeroCreatesAgilityMightVigorGold: {
      kind: "resolution",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "agility",
              creator: "token-controller",
              controller: "iteration-subject",
            },
            {
              type: "create-token",
              token: "might",
              creator: "token-controller",
              controller: "iteration-subject",
            },
            {
              type: "create-token",
              token: "vigor",
              creator: "token-controller",
              controller: "iteration-subject",
            },
            {
              type: "create-token",
              token: "gold",
              creator: "token-controller",
              controller: "iteration-subject",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: spiritOfChristmasBlue } = spiritOfChristmas.cards;
