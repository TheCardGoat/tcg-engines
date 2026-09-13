import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/prism.generated.ts";

export const prism = defineCard(fabCardIdentitiesByCanonicalId["NGkHQHjzkFqfmGLKmRCpj"], {
  abilities: {
    oncePerTurnInstantResourceResourceBanishPrismsSoulCreateSpectralShieldToken: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "banish",
            from: "soul",
            count: 1,
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
