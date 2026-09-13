import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/ball-breaker.generated.ts";

export const ballBreaker = defineCard(fabCardIdentitiesByCanonicalId["jW9czbpr7pQHgHwcq9dNH"], {
  abilities: {
    oncePerTurnActionResourceResourceAttack: {
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
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    discarded6MorePowerTurnGets1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "discard-power-6", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
});
