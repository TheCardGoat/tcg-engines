import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/demi-heroes/levia-redeemed.generated.ts";
import { bloodDebt, legendary } from "../shared/keywords.ts";

export const leviaRedeemed = defineCard(fabCardIdentitiesByCanonicalId.qjqqRn6kHWHGz6PQGWd7z, {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Levia",
    },
  ],
  abilities: {
    transformByTurningBanishedCardsFaceDown: {
      kind: "activated",
      functionalZones: ["inventory"],
      abilityType: "action",
      cost: {
        class: "effect",
        type: "turn-face-down",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["banished"],
          count: {
            type: "all",
          },
        },
      },
      condition: {
        type: "and",
        conditions: [
          {
            type: "has-status",
            status: "in-your-inventory",
          },
          {
            type: "zone-count",
            zone: "banished",
            player: "controller",
            comparison: {
              op: "gte",
              value: 13,
            },
            filter: {
              hasKeyword: "blood-debt",
            },
          },
        ],
      },
      effect: {
        type: "transform",
        target: {
          selector: "self",
        },
        into: "levia-redeemed",
      },
    },
    removeBloodDebt: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "remove-property",
        property: {
          kind: "keyword",
          keyword: bloodDebt,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent", "combat-chain", "stack", "graveyard", "banished", "hand"],
          count: {
            type: "all",
          },
        },
        duration: "permanent",
      },
    },
  },
});
