import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/kraken-s-aethervein.generated.ts";

export const krakenSAethervein = defineCard(
  fabCardIdentitiesByCanonicalId["Cd6PTGH6CqTHmt7LQmBMp"],
  {
    abilities: {
      oncePerTurnInstantResourceResourceResourceDeal1ArcaneDamageTargetOpposingDrawArcaneDamageDealtWay:
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
            amount: 3,
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "deal-damage",
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "opponent",
                },
              },
              {
                type: "draw",
                count: {
                  type: "count",
                  what: "damage-dealt",
                  damageType: "arcane",
                  per: "chain-link",
                },
                player: "controller",
              },
            ],
          },
        },
    },
  },
);
