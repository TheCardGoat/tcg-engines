import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/high-riser.generated.ts";

export const highRiser = defineCard(fabCardIdentitiesByCanonicalId["qRkrJ8t9RgGhDgpMpBBFd"], {
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
    drawnTurnGets1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "draw", player: "controller" },
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
