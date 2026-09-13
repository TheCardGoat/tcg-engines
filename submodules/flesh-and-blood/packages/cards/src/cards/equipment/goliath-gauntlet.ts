import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/goliath-gauntlet.generated.ts";

export const goliathGauntlet = defineCard(fabCardIdentitiesByCanonicalId["bPGmQFC976CBt9cTGc88t"], {
  abilities: {
    actionDestroyNextAttackActionCost2MorePlay: {
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
        appliesTo: nextAttackActionLatch({
          cost: {
            op: "gte",
            value: 2,
          },
        }),
      },
    },
  },
});
