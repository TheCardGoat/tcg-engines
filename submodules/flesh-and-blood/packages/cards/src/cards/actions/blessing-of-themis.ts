import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-themis.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const blessingOfThemis = definePitchFamily(fabPitchFamilies["blessing-of-themis"], {
  keywords: [goAgain],
  abilities: () => ({
    whenEntersArenaNameTurnAllNameBanishedZones: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "name-card",
              suggestions: ["face-up-banished"],
            },
            {
              type: "turn-face-down",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "each",
                zones: ["banished"],
                filter: {
                  hasStatus: "named-card",
                },
                count: {
                  type: "all",
                },
              },
            },
          ],
        },
      },
    },
    wheneverNameIsBanishedWhileIsArenaTurnFace: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "banish",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "named-card",
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "turn-face-down",
          target: {
            selector: "binding",
            binding: "it",
          },
        },
      },
    },
    atStartTurnPutIntoSoul: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "soul",
          },
        },
      },
    },
  }),
});
export const { yellow: blessingOfThemisYellow } = blessingOfThemis.cards;
