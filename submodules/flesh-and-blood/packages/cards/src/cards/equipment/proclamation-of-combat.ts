import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/proclamation-of-combat.generated.ts";

export const proclamationOfCombat = defineCard(
  fabCardIdentitiesByCanonicalId["LwtRft6CKgLFgbDKrwTJn"],
  {
    abilities: {
      actionDestroyUntilStartNextTurnOnlyActionsHeroes: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "play",
          filter: {
            typeBox: {
              types: ["Action"],
              excludeSubtypes: ["Attack"],
            },
          },
          duration: "until-start-of-own-next-turn",
        },
      },
    },
  },
);
