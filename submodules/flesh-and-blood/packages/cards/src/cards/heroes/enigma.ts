import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/enigma.generated.ts";

export const enigma = defineCard(fabCardIdentitiesByCanonicalId["JKPFKKFqnLtmctLkwNCmc"], {
  abilities: {
    firstSpectralShieldAttackTurnCostsResourceLessActivate: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-activation-cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          // Classic Spectral Shield is Illusionist/Token/Aura by name — not
          // Spectral+Shield subtypes. Match the printed name so Cosmo/Luminaris
          // granted aura attacks qualify as Spectral Shield attacks.
          next: {
            name: "Spectral Shield",
          },
          ordinal: 1,
          // Printed "each turn" — re-arm the ordinal quota every turn.
          perTurn: true,
        },
      },
    },
    oncePerTurnInstantChiChiChiCreateSpectralShieldToken1PowerCounter: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "chi",
        amount: 3,
      },
      effect: {
        type: "create-token",
        token: "spectral-shield",
        controller: "controller",
        withCounters: {
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
        },
      },
    },
  },
});
