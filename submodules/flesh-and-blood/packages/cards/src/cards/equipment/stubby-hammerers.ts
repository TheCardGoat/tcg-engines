import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stubby-hammerers.generated.ts";

export const stubbyHammerers = defineCard(fabCardIdentitiesByCanonicalId["wj7qpMrzMjDbn8tmtfPL7"], {
  abilities: {
    actionDestroyStubbyHammerersAttackAction3LessBase: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          ...nextAttackActionLatch({
            numeric: [
              {
                property: "power",
                basis: "base",
                comparison: { op: "lte", value: 3 },
              },
            ],
          }),
          count: { type: "all" },
        },
      },
    },
  },
});
