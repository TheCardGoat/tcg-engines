import { createToken } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { targetAttackPowerAndWager } from "../../authoring/wager-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/small-blinder.generated.ts";

export const smallBlinder = definePitchFamily(fabPitchFamilies["small-blinder"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount) => ({
    boostSwordAndWagerBladeDance: targetAttackPowerAndWager({
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

export const {
  red: smallBlinderRed,
  yellow: smallBlinderYellow,
  blue: smallBlinderBlue,
} = smallBlinder.cards;
