import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/prizeworn-gauntlet.generated.ts";

export const prizewornGauntlet = defineCard(
  fabCardIdentitiesByCanonicalId["LcDcpG8KLwjzKkdqwpnHn"],
  {
    keywords: [guardwell],
    abilities: {
      wheneverWinWagerMayHeroDestroyIfDoCreate: {
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
              cost: {
                class: "mixed",
                type: "all",
                costs: [
                  { class: "effect", type: "tap-hero" },
                  { class: "effect", type: "destroy-self" },
                ],
              },
            },
            then: { type: "create-token", token: "courage", controller: "controller" },
          },
        },
      },
    },
  },
);
