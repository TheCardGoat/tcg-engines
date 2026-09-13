import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/melody-sing-along.generated.ts";

export const melodySingAlong = defineCard(fabCardIdentitiesByCanonicalId["npDPz98H6BnJGDzHBmdGk"], {
  abilities: {
    wheneverPlaySongCreateCopperTokensEqualNumberOtherGame: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              moniker: "Song",
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "copper",
          controller: "controller",
          count: {
            type: "count",
            what: "heroes",
            player: "opponent",
          },
        },
      },
    },
  },
});
