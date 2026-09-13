import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/prizeworn-pathfinders.generated.ts";

export const prizewornPathfinders = defineCard(
  fabCardIdentitiesByCanonicalId["hGWwgMph6rFkMJJKq8Bqq"],
  {
    keywords: [battleworn],
    abilities: {
      wheneverWinWagerMayPayIfDoRemove1: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "wager-win",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "none" },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "pay",
              payer: "controller",
              cost: { class: "asset", type: "resources", amount: 1 },
            },
            then: {
              type: "remove-counters",
              counter: { kind: "numeric", value: -1, property: "defense" },
              count: 1,
              target: { selector: "self" },
            },
          },
        },
      },
    },
  },
);
