import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/blood-harvest.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const bloodHarvest = defineCard(fabCardIdentitiesByCanonicalId["HKQMBnGq8PCKJTdrjmfGk"], {
  keywords: [bloodDebt],
  abilities: {
    instantBanishFromHandGain: {
      kind: "activated",
      functionalZones: ["hand"],
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "banish-self",
      },
      effect: {
        type: "gain-resources",
        amount: 3,
      },
    },
  },
});
