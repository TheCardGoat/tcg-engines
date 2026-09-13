import { onHit } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/breach-flesh.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const breachFlesh = definePitchFamily(fabPitchFamilies["breach-flesh"], {
  keywords: [bloodDebt],
  abilities: () => ({
    onHit: onHit({
      type: "create-token",
      token: "gate-to-i-arathael",
      controller: "controller",
    }),
  }),
});

export const {
  red: breachFleshRed,
  yellow: breachFleshYellow,
  blue: breachFleshBlue,
} = breachFlesh.cards;
