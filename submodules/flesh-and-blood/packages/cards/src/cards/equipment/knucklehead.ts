import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/knucklehead.generated.ts";

export const knucklehead = defineCard(fabCardIdentitiesByCanonicalId["WqDtDMqJhHBhHfdjTRRFb"], {
  keywords: [
    {
      name: "specialization",
      hero: "Kayo",
    },
    temper,
  ],
  abilities: {
    actionDestroyRoll6SidedDieUntilEndTurn: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "roll",
            sides: 6,
          },
          {
            type: "modify-numeric",
            property: "intellect",
            op: "set-base",
            amount: {
              type: "roll-result",
            },
            target: {
              selector: "controller",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  },
});
