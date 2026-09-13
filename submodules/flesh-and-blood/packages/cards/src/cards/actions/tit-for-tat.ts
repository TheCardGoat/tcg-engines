import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tit-for-tat.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const titForTat = definePitchFamily(fabPitchFamilies["tit-for-tat"], {
  keywords: [goAgain],
  abilities: () => ({
    tHeroUAnotherHero: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "tap",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "any",
              zones: ["hero"],
              count: 1,
            },
          },
          {
            type: "untap",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "any",
              zones: ["hero"],
              count: 1,
            },
          },
        ],
      },
    },
  }),
});

export const { blue: titForTatBlue } = titForTat.cards;
