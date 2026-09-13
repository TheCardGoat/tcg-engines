import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sun-kiss.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sunKiss = definePitchFamily(fabPitchFamilies["sun-kiss"], {
  parameters: pitchMap({
    red: { amount: 3 },
    yellow: { amount: 2 },
    blue: { amount: 1 },
  }),
  abilities: ({ amount }) => ({
    gainLife: {
      type: "gain-life",
      amount,
      target: { selector: "controller" },
    },
    rewardMoonWish: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        filter: { name: "Moon Wish" },
      },
      layerKeywords: [goAgain],
      effect: { type: "draw", count: 1, player: "controller" },
    },
  }),
});

export const { red: sunKissRed, yellow: sunKissYellow, blue: sunKissBlue } = sunKiss.cards;
