import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/fingers-of-fragmentation.generated.ts";

export const fingersOfFragmentation = defineCard(
  fabCardIdentitiesByCanonicalId["PgCtkKz6JjJQ9mgKK679T"],
  {
    abilities: {
      instantDestroyTargetAttackActionHasFragmentedGets2: {
        kind: "activated",
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
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: attackActionFilter({ hasStatus: "fragmented" }),
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    },
  },
);
