import { createToken } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { nextAttackPowerAndWager } from "../../authoring/wager-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/gutshot.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const gutshot = definePitchFamily(fabPitchFamilies.gutshot, {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolve: nextAttackPowerAndWager({
      amount,
      filter: { typeBox: { subtypes: ["Sword"] } },
      prize: createToken({
        token: "blade-dance",
        creator: "token-controller",
        controller: "winner",
      }),
    }),
  }),
});
export const { red: gutshotRed, yellow: gutshotYellow, blue: gutshotBlue } = gutshot.cards;
