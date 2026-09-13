import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/scepter-of-pain.generated.ts";

export const scepterOfPain = defineCard(fabCardIdentitiesByCanonicalId["jktJDQ97DD6rnkQjhNdD8"], {
  abilities: {
    oncePerTurnActionResourceResourceDeal1ArcaneDamageAnyOpposingTargetCreateRunechantTokenDamageDealtWay:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "object",
                declared: "on-stack",
                player: "opponent",
                zones: ["hero", "permanent"],
                count: 1,
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "damage-dealt-this-way",
                comparison: { op: "gt", value: 0 },
              },
              then: {
                type: "create-token",
                token: "runechant",
                controller: "controller",
              },
            },
          ],
        },
      },
  },
});
