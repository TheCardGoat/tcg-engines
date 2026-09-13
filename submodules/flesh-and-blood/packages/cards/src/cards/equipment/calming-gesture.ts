import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/calming-gesture.generated.ts";

export const calmingGesture = defineCard(fabCardIdentitiesByCanonicalId["nDkh8FDGwNNpLghj6grmK"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    instantDestroyCreateSpectralShieldToken: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "create-token",
        token: "spectral-shield",
        controller: "controller",
      },
    },
  },
});
