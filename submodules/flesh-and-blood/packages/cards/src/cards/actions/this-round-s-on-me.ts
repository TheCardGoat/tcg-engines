import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/this-round-s-on-me.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const thisRoundSOnMe = definePitchFamily(fabPitchFamilies["this-round-s-on-me"], {
  keywords: [goAgain],
  abilities: () => ({
    eachHeroDraws: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 1,
        player: "each",
      },
    },
    untilStartNextTurnAttacksHaveNumber1Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "until-start-of-own-next-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "targeting-you",
          },
          count: { type: "all" },
          events: ["attack"],
        },
      },
    },
  }),
});

export const { blue: thisRoundSOnMeBlue } = thisRoundSOnMe.cards;
