import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/booze.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const booze = definePitchFamily(fabPitchFamilies["booze"], {
  keywords: [goAgain],
  abilities: () => ({
    whenEntersLeavesArenaCrowdBoos: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "enter-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
            {
              name: "leave-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "crowd-boos",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
    atStartTurnDestroy: {
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
  }),
});
export const { blue: boozeBlue } = booze.cards;
