import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/time-skippers.generated.ts";

export const timeSkippers = defineCard(fabCardIdentitiesByCanonicalId["8bQNhwM8ftgcPwJzLKjKF"], {
  abilities: {
    actionDestroyGain2ActionPoints: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "gain-action-points",
        amount: 2,
      },
    },
  },
});
