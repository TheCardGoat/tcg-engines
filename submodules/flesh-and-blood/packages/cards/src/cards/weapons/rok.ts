import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/rok.generated.ts";

export const rok = defineCard(fabCardIdentitiesByCanonicalId["KrjrwRtnjcK7hNhcBdH9h"], {
  abilities: {
    oncePerTurnActionResourceResourceResourceAttackActivateRokOnlyNoHand: {
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
      condition: {
        type: "zone-count",
        zone: "hand",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    damageDealtRokCantPrevented: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "be-prevented",
        subject: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
});
