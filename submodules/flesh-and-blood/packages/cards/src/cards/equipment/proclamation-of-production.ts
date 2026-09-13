import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/proclamation-of-production.generated.ts";

export const proclamationOfProduction = defineCard(
  fabCardIdentitiesByCanonicalId["7tzgdpf9qnJbqRp6PTNj7"],
  {
    abilities: {
      actionDestroyEachHeroMaySearchTheirDeckItem: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "for-each",
          target: {
            selector: "each-hero",
          },
          effect: {
            type: "optional",
            chooser: "controller",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "search",
                  zones: ["deck"],
                  player: "controller",
                  filter: {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                    cost: {
                      op: "lte",
                      value: 1,
                    },
                  },
                  to: {
                    zone: "permanent",
                  },
                  mayFail: true,
                },
                {
                  type: "shuffle",
                  zone: "deck",
                },
              ],
            },
          },
        },
      },
    },
  },
);
