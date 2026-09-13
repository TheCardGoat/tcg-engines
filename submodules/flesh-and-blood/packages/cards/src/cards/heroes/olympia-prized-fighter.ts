import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/olympia-prized-fighter.generated.ts";

export const olympiaPrizedFighter = defineCard(
  fabCardIdentitiesByCanonicalId["9JqrM7dbgfG87L6tPghrM"],
  {
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
  },
);
