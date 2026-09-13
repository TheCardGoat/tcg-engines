import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/two-steps-forward.generated.ts";

export const twoStepsForward = defineCard(fabCardIdentitiesByCanonicalId["Twn68rHRjHKDjmnpDQddH"], {
  keywords: [battleworn],
  abilities: {
    instantDestroyCreateAgilityTokenActivateOnlyIfVe: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "combat-chain-hits" },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "create-token",
        token: "agility",
        controller: "controller",
      },
    },
  },
});
