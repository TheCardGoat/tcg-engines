import { createToken } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { targetAttackPowerAndWager } from "../../authoring/wager-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/big-blinder.generated.ts";

export const bigBlinder = definePitchFamily(fabPitchFamilies["big-blinder"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount) => ({
    boostSwordAndWagerFlurry: targetAttackPowerAndWager({
      amount,
      filter: { typeBox: { subtypes: ["Sword"] } },
      prize: createToken({ token: "flurry", creator: "token-controller", controller: "winner" }),
    }),
  }),
});

export const {
  red: bigBlinderRed,
  yellow: bigBlinderYellow,
  blue: bigBlinderBlue,
} = bigBlinder.cards;
