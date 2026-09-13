import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/crucible-of-aetherweave.generated.ts";

export const crucibleOfAetherweave = defineCard(
  fabCardIdentitiesByCanonicalId["nzDWrNMqGWgmJfgJhChNb"],
  {
    abilities: {
      oncePerTurnInstantResourceNextPlayTurnEffectDealsArcaneDamageInsteadDealsMuchArcaneDamagePlus1:
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "instant",
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          effect: {
            type: "replacement",
            replacementKind: "standard",
            replaces: {
              name: "damage",
              damageType: "arcane",
            },
            modification: {
              type: "modify-numeric",
              property: "count",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                hasStatus: "arcane-damage-effect",
              },
            },
          },
        },
    },
  },
);
