import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/raydn-duskbane.generated.ts";

export const raydnDuskbane = defineCard(fabCardIdentitiesByCanonicalId["zBjL8PJJGGwQPqHrk7RnP"], {
  abilities: {
    oncePerTurnAction0Attack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    chargedTurnRaydnGains3Power: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
});
