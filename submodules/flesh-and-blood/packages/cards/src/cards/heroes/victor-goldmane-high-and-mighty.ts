import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/victor-goldmane-high-and-mighty.generated.ts";

export const victorGoldmaneHighAndMighty = defineCard(
  fabCardIdentitiesByCanonicalId["fc8jMwTprwnhRbPKDmF9J"],
  {
    abilities: {
      firstTimeTurnCreateGoldTokenEffectDraw: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "create",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "created-object",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Gold",
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "draw",
            count: 1,
            player: "controller",
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
        label: {
          name: "clash",
        },
      },
      firstTimeTurnFailWinClashInsteadDestroyGoldPut1RevealedBottomOwnersDeckThenClashAgain: {
        kind: "static",
        staticKind: "continuous",
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
        effect: {
          type: "replacement",
          replacementKind: "outcome",
          replaces: {
            name: "clash-outcome",
            player: "controller",
          },
          modification: {
            type: "optional",
            effect: {
              type: "reclash",
              from: "replaced-clash",
              cost: {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    name: "Gold",
                  },
                  count: 1,
                },
              },
            },
          },
          duration: "while-in-arena",
        },
        label: {
          name: "clash",
        },
      },
    },
  },
);
