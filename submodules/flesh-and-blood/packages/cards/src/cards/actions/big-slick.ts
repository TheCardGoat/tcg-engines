import { draw } from "@tcg/flesh-and-blood-types";

import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { nextAttackPowerAndWager } from "../../authoring/wager-patterns.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/big-slick.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bigSlick = definePitchFamily(fabPitchFamilies["big-slick"], {
  parameters: pitchMap({ red: 5, yellow: 4, blue: 3 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolve: nextAttackPowerAndWager({
      amount,
      filter: { typeBox: { subtypes: ["Sword"] } },
      prize: draw(1, "winner"),
    }),
  }),
});

export const { red: bigSlickRed, yellow: bigSlickYellow, blue: bigSlickBlue } = bigSlick.cards;
