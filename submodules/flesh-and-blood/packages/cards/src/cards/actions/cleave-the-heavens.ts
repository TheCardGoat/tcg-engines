import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cleave-the-heavens.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const cleaveTheHeavens = definePitchFamily(fabPitchFamilies["cleave-the-heavens"], {
  keywords: [bloodDebt],
  abilities: () => ({
    instant: {
      kind: "activated",
      functionalZones: ["hand"],
      abilityType: "instant",
      cost: { class: "effect", type: "banish-self" },
      effect: {
        type: "create-token",
        token: "gate-to-i-arathael",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: cleaveTheHeavensRed,
  yellow: cleaveTheHeavensYellow,
  blue: cleaveTheHeavensBlue,
} = cleaveTheHeavens.cards;
