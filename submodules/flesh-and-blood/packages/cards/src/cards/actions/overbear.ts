import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overbear.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const overbear = definePitchFamily(fabPitchFamilies.overbear, {
  keywords: [goAgain],
  abilities: () => ({
    dominate: grantKeyword(dominate, {
      appliesTo: { next: { typeBox: { types: ["Weapon"] } } },
    }),
  }),
});

export const { red: overbearRed } = overbear.cards;
