import { createToken } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { nextAttackPowerAndWager } from "../../authoring/wager-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/showdown.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const showdown = definePitchFamily(fabPitchFamilies.showdown, {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    nextAttackPowerAndWager: nextAttackPowerAndWager({
      amount,
      filter: { typeBox: { subtypes: ["Sword"] } },
      prize: createToken({ token: "flurry", creator: "token-controller", controller: "winner" }),
    }),
  }),
});

export const { red: showdownRed, yellow: showdownYellow, blue: showdownBlue } = showdown.cards;
