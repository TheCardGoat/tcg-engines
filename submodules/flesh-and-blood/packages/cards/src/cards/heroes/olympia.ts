import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/olympia.generated.ts";

export const olympia = defineCard(fabCardIdentitiesByCanonicalId["t7H7JCQcTb9TTjjCbNwDH"], {
  abilities: {
    firstTimeAttacksWinsWagerCreateGoldToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "wager-win",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
      },
      limit: {
        count: 1,
        per: "attack",
        ordinals: [1],
      },
    },
  },
});
