import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/squizzy-floof.generated.ts";

export const squizzyFloof = defineCard(fabCardIdentitiesByCanonicalId["czfMfgfthg6qKLtKBMQjD"], {
  abilities: {
    startOpposingHerosTurnCreateCrackedBaubleHandCreateGoldToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          // Opponent chooses ("they may create a Cracked Bauble…").
          type: "optional",
          chooser: "opponent",
          effect: {
            type: "create-token",
            token: "cracked-bauble",
            creator: "token-controller",
            controller: "opponent",
            to: { zone: "hand" },
          },
          then: {
            type: "create-token",
            token: "gold",
            controller: "controller",
          },
        },
      },
    },
  },
});
