import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/prism-sculptor-of-arc-light.generated.ts";

export const prismSculptorOfArcLight = defineCard(
  fabCardIdentitiesByCanonicalId["F7rQpTDjHFWPgQhcGg7RT"],
  {
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
  },
);
