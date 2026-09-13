import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/vestige-of-flagellation.generated.ts";

export const vestigeOfFlagellation = defineCard(
  fabCardIdentitiesByCanonicalId["WnnC99QDftcbRMNcKKwmk"],
  {
    keywords: [bladeBreak],
    abilities: {
      firstTimeOpponentWouldGainEachTurnInsteadLose: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          // Life events are gain-life (not generic "gain", which is power-gain residue).
          replaces: {
            name: "gain-life",
            player: "opponent",
          },
          modification: {
            type: "sequence",
            steps: [
              {
                type: "lose-life",
                amount: {
                  type: "event-amount",
                },
                target: {
                  selector: "controller",
                },
              },
              {
                type: "create-token",
                token: "vigor",
                controller: "controller",
                count: {
                  type: "event-amount",
                },
              },
            ],
          },
          limit: {
            count: 1,
            per: "turn",
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
