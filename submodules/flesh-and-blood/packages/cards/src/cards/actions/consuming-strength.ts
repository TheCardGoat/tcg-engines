import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/consuming-strength.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const consumingStrength = definePitchFamily(fabPitchFamilies["consuming-strength"], {
  keywords: [bloodDebt],
  abilities: () => ({
    restriction: {
      kind: "static",
      staticKind: "continuous",
      functionalZones: ["hand", "banished"],
      condition: {
        type: "not",
        condition: { type: "control-object", filter: { nameContains: "Blasmophet" } },
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: { name: "Consuming Strength" },
        duration: "while-condition",
      },
    },
    instant: {
      kind: "activated",
      functionalZones: ["hand"],
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 1 },
          { class: "effect", type: "banish-self" },
        ],
      },
      effect: plusPower(2, { appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } } }),
    },
  }),
});
export const { yellow: consumingStrengthYellow } = consumingStrength.cards;
