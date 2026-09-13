import { goAgain, piercing } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/graven-call.generated.ts";

export const gravenCall = defineCard(fabCardIdentitiesByCanonicalId["Ng9LqqDzcwcTmQmDzWzjT"], {
  keywords: [piercing(1)],
  abilities: {
    oncePerTurnActionResourceResourceAttackGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    instantDestroy2SilverEquip1PowerCounterActivateAbilityOnlyGraveyard: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy",
        count: 2,
        filter: {
          name: "Silver",
        },
      },
      condition: {
        type: "has-status",
        status: "in-your-graveyard",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "equip",
            target: {
              selector: "self",
            },
          },
          {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        ],
      },
    },
  },
});
