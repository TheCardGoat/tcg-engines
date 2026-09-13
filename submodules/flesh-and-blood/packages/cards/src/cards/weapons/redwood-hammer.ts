import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/redwood-hammer.generated.ts";

export const redwoodHammer = defineCard(fabCardIdentitiesByCanonicalId["8BgkFbrc7PmgQhT8bK6BC"], {
  abilities: {
    oncePerTurnActionResourceResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    earthPitchedAttackAttackGets1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-earth-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
      },
    },
  },
});
