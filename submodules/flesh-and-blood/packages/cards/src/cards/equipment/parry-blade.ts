import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/parry-blade.generated.ts";

export const parryBlade = defineCard(fabCardIdentitiesByCanonicalId["8RgDcJhnpLP9j6DqNqPfp"], {
  keywords: [bladeBreak],
  abilities: {
    oncePerTurnActionAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    gets2WhileDefendingWeaponAttack: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "conditional",
        condition: {
          type: "has-status",
          status: "defending-a-weapon-attack",
        },
        then: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  },
});
