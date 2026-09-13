import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bloodied-strapping.generated.ts";

export const bloodiedStrapping = defineCard(
  fabCardIdentitiesByCanonicalId["fMrFHR8DtpGQkCcHDCrDM"],
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
      actionDestroyNextAttackActionPlayTurnCostsLess: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
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
