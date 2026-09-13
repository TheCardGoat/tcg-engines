import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/boots-to-the-boards.generated.ts";

export const bootsToTheBoards = defineCard(
  fabCardIdentitiesByCanonicalId["bCKDD6gGb8dKzNdprDzff"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsPayUpCreateManyToughnessTokens: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "optional",
                effect: {
                  type: "pay",
                  cost: {
                    class: "asset",
                    type: "resources",
                    amount: {
                      type: "up-to",
                      amount: 3,
                    },
                  },
                  payer: "controller",
                },
              },
              {
                type: "create-token",
                token: "toughness",
                controller: "controller",
                count: {
                  type: "count",
                  what: "resources-paid-this-way",
                },
              },
            ],
          },
        },
      },
    },
  },
);
