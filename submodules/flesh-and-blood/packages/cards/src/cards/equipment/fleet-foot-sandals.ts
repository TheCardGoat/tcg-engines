import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/fleet-foot-sandals.generated.ts";

export const fleetFootSandals = defineCard(
  fabCardIdentitiesByCanonicalId["gJnrmh7M9pLPfkfNnzfMk"],
  {
    abilities: {
      attackReactionDestroyFleetFootSandalsTargetAttack1: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              numeric: [
                {
                  property: "power",
                  basis: "base",
                  comparison: { op: "lte", value: 1 },
                },
              ],
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    },
  },
);
