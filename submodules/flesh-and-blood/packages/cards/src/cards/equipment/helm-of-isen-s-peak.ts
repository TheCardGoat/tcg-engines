import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-isen-s-peak.generated.ts";

export const helmOfIsenSPeak = defineCard(fabCardIdentitiesByCanonicalId["rjhDRz7JGN7kpDdjHQfrg"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyHeroGains1Turn: {
      kind: "activated",
      abilityType: "action",
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
        type: "modify-numeric",
        property: "intellect",
        op: "add",
        amount: 1,
        target: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  },
});
