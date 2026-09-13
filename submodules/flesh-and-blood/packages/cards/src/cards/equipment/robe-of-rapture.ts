import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/robe-of-rapture.generated.ts";

export const robeOfRapture = defineCard(fabCardIdentitiesByCanonicalId["CKdtt7jhNp8DK9QzCqGkz"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    actionDestroyRobeRaptureGain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "gain-resources",
        amount: 3,
      },
    },
  },
});
