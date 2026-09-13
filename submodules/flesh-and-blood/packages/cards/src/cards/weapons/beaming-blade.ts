import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/beaming-blade.generated.ts";

export const beamingBlade = defineCard(fabCardIdentitiesByCanonicalId["kG8dtfK6bQqncJjNm6wNL"], {
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
    yellowPutHerosSoulTurnGets5Power: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "yellow-into-soul", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 5,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
});
