import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/let-me-buy-you-a-drink.generated.ts";

export const letMeBuyYouADrink = defineCard(fabCardIdentitiesByCanonicalId.tgkMhwLnr8kh6pcR86nR6, {
  abilities: {
    destroyGold: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Gold",
          },
          count: 1,
        },
      },
    },
    rewardOpponentAndWeakenAttacks: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-opponent",
          },
          {
            type: "draw",
            count: 1,
            player: "attack-target",
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: -2,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Attack"],
                },
                hasStatus: "targeting-you",
              },
              count: {
                type: "all",
              },
            },
            duration: "until-start-of-own-next-turn",
          },
        ],
      },
    },
  },
});
