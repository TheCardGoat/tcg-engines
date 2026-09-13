import { bondAbility, createToken } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bracken-rap.generated.ts";

export const brackenRap = definePitchFamily(fabPitchFamilies["bracken-rap"], {
  abilities: () => ({
    earthBond: bondAbility({
      talent: "Earth",
      on: "attack",
      effect: createToken("might"),
    }),
  }),
});
export const { red: brackenRapRed, yellow: brackenRapYellow } = brackenRap.cards;
