import { createToken } from "@tcg/flesh-and-blood-types";

import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { nextAttackPowerAndWager } from "../../authoring/wager-patterns.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/belly-buster.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bellyBuster = definePitchFamily(fabPitchFamilies["belly-buster"], {
  parameters: { red: 3, blue: 1 },
  keywords: [goAgain],
  abilities: (amount) => ({
    resolve: nextAttackPowerAndWager({
      amount,
      filter: { typeBox: { supertypes: ["Warrior"] } },
      prize: createToken({ token: "courage", creator: "token-controller", controller: "winner" }),
      optional: true,
    }),
  }),
});

export const { red: bellyBusterRed, blue: bellyBusterBlue } = bellyBuster.cards;
