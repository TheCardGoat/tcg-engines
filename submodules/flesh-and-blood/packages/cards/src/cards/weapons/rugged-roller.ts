import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/rugged-roller.generated.ts";

export const ruggedRoller = defineCard(fabCardIdentitiesByCanonicalId["JGTWPHkq97qTw6qtMgNHN"], {
  abilities: {
    oncePerTurnActionResourceAttackActivateRuggedRollerOnlyRolled6DieTurn: {
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
      condition: { type: "performed-this-turn", event: "roll-6", player: "controller" },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  },
});
