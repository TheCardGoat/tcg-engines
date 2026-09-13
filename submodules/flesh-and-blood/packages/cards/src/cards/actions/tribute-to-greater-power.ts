import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tribute-to-greater-power.generated.ts";
import { bloodDebt, overpower } from "../shared/keywords.ts";

export const tributeToGreaterPower = definePitchFamily(
  fabPitchFamilies["tribute-to-greater-power"],
  {
    keywords: [bloodDebt],
    abilities: () => ({
      instant: {
        kind: "activated",
        functionalZones: ["hand"],
        abilityType: "instant",
        cost: { class: "effect", type: "banish-self" },
        effect: grantKeyword(overpower, {
          appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } },
        }),
      },
    }),
  },
);
export const { red: tributeToGreaterPowerRed } = tributeToGreaterPower.cards;
