import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/ire-of-the-crowd.generated.ts";

export const ireOfTheCrowd = defineCard(fabCardIdentitiesByCanonicalId["7TBhRR7QqNj86D7Crj6Rq"], {
  abilities: {
    loseLifeIfNoHit: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "not",
          condition: { type: "performed-this-turn", event: "hit", player: "controller" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-life",
          amount: 2,
          target: {
            selector: "controller",
          },
        },
      },
    },
  },
});
