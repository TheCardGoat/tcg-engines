import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/satiate-bloodthirst.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const satiateBloodthirst = definePitchFamily(fabPitchFamilies["satiate-bloodthirst"], {
  keywords: [bloodDebt],
  abilities: () => ({
    instant: {
      kind: "activated",
      functionalZones: ["hand"],
      abilityType: "instant",
      cost: { class: "effect", type: "banish-self" },
      effect: {
        type: "gain-life",
        amount: 1,
        target: { selector: "controller" },
      },
    },
  }),
});

export const {
  red: satiateBloodthirstRed,
  yellow: satiateBloodthirstYellow,
  blue: satiateBloodthirstBlue,
} = satiateBloodthirst.cards;
