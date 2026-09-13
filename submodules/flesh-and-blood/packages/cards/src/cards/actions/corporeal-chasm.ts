import { onHit } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/corporeal-chasm.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const corporealChasm = definePitchFamily(fabPitchFamilies["corporeal-chasm"], {
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
  red: corporealChasmRed,
  yellow: corporealChasmYellow,
  blue: corporealChasmBlue,
} = corporealChasm.cards;
