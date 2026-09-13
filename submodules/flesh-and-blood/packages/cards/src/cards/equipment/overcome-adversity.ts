import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/overcome-adversity.generated.ts";

export const overcomeAdversity = defineCard(
  fabCardIdentitiesByCanonicalId["BrCKk9JLw8r69fGgNt8BH"],
  {
    keywords: [bladeBreak],
    abilities: {
      mayOnlyDefendAttackIfAttackSControllerHas: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          // "May only ... if" is a positive legality requirement. A restrict
          // would invert the printed condition by rejecting the valid attack.
          mode: "require",
          action: "defend",
          filter: {
            name: "Overcome Adversity",
          },
          duration: "while-in-arena",
          subject: {
            controllerDestroyedTokenThisTurn: "Agility",
          },
        },
      },
    },
  },
);
