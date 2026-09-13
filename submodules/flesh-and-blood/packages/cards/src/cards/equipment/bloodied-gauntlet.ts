import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bloodied-gauntlet.generated.ts";

export const bloodiedGauntlet = defineCard(
  fabCardIdentitiesByCanonicalId["K6CjrfF8bkMCL8WBhfwPc"],
  {
    abilities: {
      mayEquip: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "optional",
          effect: {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        },
      },
      actionDestroyNextAttackActionPlayTurnGets2: {
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
          amount: 2,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
      },
    },
  },
);
