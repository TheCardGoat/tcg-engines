import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/surgent-aethertide.generated.ts";

export const surgentAethertide = defineCard(
  fabCardIdentitiesByCanonicalId["g69J9qNWrLQRfCbT8D9jk"],
  {
    abilities: {
      oncePerTurnActionResourceResourceDeal1ArcaneDamageOpposingGoAgain: {
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
        layerKeywords: [goAgain],
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "opponent",
          },
        },
      },
      firstPlayTurnArcaneDamageEffectInsteadDealsMuchArcaneDamagePlusXWhereXDamageDealtSurgentAethertideTurn:
        {
          kind: "static",
          staticKind: "continuous",
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
              amount: {
                type: "count",
                what: "damage-dealt",
                damageType: "arcane",
                per: "turn",
                filter: {
                  name: "Surgent Aethertide",
                },
              },
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
              ordinal: 1,
            },
          },
        },
    },
  },
);
