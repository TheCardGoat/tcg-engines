import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/gate-to-i-arathael.generated.ts";

export const gateToIArathael = defineCard(fabCardIdentitiesByCanonicalId.JtkWt6Kzpgz9qpPLPp8Ff, {
  abilities: {
    playBloodDebtActionFromBanish: {
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
        type: "play-card",
        fromZones: ["banished"],
        source: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["banished"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
            hasKeyword: "blood-debt",
          },
          count: { type: "up-to", amount: 1 },
          // CR 1.8.5e: "may ... target" is declined by declaring no target
          // when the activated layer is created, not by a second choice at
          // resolution after activation costs have been paid.
        },
        duration: "this-turn",
      },
    },
  },
});
