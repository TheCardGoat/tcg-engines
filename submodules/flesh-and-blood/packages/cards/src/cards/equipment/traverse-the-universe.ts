import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/traverse-the-universe.generated.ts";

export const traverseTheUniverse = defineCard(
  fabCardIdentitiesByCanonicalId["dgBPpWggJ6wkFQG8t9Jqc"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsSearchDeckInnerChiRevealPutInto: {
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
                type: "search",
                zones: ["deck"],
                filter: {
                  name: "Inner Chi",
                },
                mayFail: true,
                to: {
                  zone: "hand",
                },
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
);
