import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hope-merchant-s-hood.generated.ts";

export const hopeMerchantSHood = defineCard(
  fabCardIdentitiesByCanonicalId["DW7LjrR6RwKPhNB8d9CGM"],
  {
    abilities: {
      instantDestroyShuffleAnyNumberFromHandIntoDeck: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  // "any number" = 0..hand size (not mandatory all).
                  type: "move-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["hand"],
                    count: {
                      type: "any-number",
                    },
                    upTo: true,
                  },
                  to: {
                    zone: "deck",
                  },
                },
                {
                  type: "shuffle",
                  zone: "deck",
                },
              ],
            },
            {
              type: "draw",
              count: {
                type: "count",
                what: "shuffled-this-way",
              },
              player: "controller",
            },
          ],
        },
      },
    },
  },
);
