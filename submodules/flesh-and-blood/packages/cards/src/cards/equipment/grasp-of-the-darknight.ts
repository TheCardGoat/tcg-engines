import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/grasp-of-the-darknight.generated.ts";

/**
 * IAR109 Grasp of the Darknight — Shadow Runeblade Arms d0.
 *
 * Printed:
 *   Action - {r}, destroy this: Opt 1, then create a Runechant token. Go again
 *
 * Model notes (hand-authored; case-by-case):
 * - Mixed cost: 1{r} + destroy-self.
 * - Sequence opt 1 then create-token runechant under controller.
 * - layerKeywords goAgain refunds the Action AP.
 * - Model already matched printed text; no residual filters.
 */
export const graspOfTheDarknight = defineCard(
  fabCardIdentitiesByCanonicalId["jrMzQzBmGK9LjRhQmPhCw"],
  {
    abilities: {
      actionDestroyOpt1ThenCreateRunechantTokenGo: {
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
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "opt",
              count: 1,
            },
            {
              type: "create-token",
              token: "runechant",
              controller: "controller",
            },
          ],
        },
      },
    },
  },
);
