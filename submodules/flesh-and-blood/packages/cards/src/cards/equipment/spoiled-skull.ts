import { arcaneBarrier, bloodDebt, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/spoiled-skull.generated.ts";

export const spoiledSkull = defineCard(fabCardIdentitiesByCanonicalId["jtjBwktMzPCDdwFgKtWT6"], {
  // go again is the Action layer keyword, not a static equipment keyword.
  keywords: [arcaneBarrier(1), bloodDebt],
  abilities: {
    actionBanishTarget3ActionDifferentNamesBanishedZone: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          // "banish this" — not banish any arena permanent.
          {
            class: "effect",
            type: "banish-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "sequence",
            steps: [
              {
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "on-stack",
                  player: "controller",
                  zones: ["banished"],
                  filter: {
                    typeBox: {
                      types: ["Action"],
                    },
                    differentNames: true,
                  },
                  count: 3,
                },
                outputBinding: "them",
              },
              {
                type: "choose-card",
                random: true,
                target: {
                  selector: "binding",
                  binding: "them",
                },
                outputBinding: "it",
              },
            ],
          },
          {
            type: "play-card",
            fromZones: ["banished"],
            source: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  },
});
