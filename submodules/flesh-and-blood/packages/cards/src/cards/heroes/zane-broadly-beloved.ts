import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/zane-broadly-beloved.generated.ts";

export const zaneBroadlyBeloved = defineCard(
  fabCardIdentitiesByCanonicalId["tjQzWM7HtWqpk8R8T8TNW"],
  {
    abilities: {
      equip2HSwordsThoughWere1H: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "equip",
          filter: { typeBox: { subtypes: ["Sword", "2H"] } },
          handedness: "2h-sword-as-1h",
          duration: "while-in-arena",
        },
      },
      wheneverWinWagerCrowdCheers: {
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
        resolution: { kind: "effect", effect: { type: "crowd-cheers", target: "controller" } },
        label: { name: "the-crowd-cheers" },
      },
      firstTimeCrowdCheersTurnDraws: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "crowd-cheers",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "none" },
          },
        },
        limit: { count: 1, per: "turn", ordinals: [1] },
        resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "each" } },
      },
    },
  },
);
