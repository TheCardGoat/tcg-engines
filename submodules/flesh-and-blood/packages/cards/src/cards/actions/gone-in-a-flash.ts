import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gone-in-a-flash.generated.ts";

export const goneInAFlash = definePitchFamily(fabPitchFamilies["gone-in-a-flash"], {
  abilities: () => ({
    whenAttacksNextTimePlayInstantChainLinkMay: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "delayed-trigger",
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
                  typeBox: {
                    types: ["Instant"],
                  },
                },
                bindAs: "it",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-chain-link",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "self",
                },
                to: {
                  zone: "hand",
                },
              },
            },
          },
        },
      },
    },
  }),
});
export const { red: goneInAFlashRed } = goneInAFlash.cards;
