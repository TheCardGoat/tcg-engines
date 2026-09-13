import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bloodspill-invocation.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bloodspillInvocation = definePitchFamily(fabPitchFamilies["bloodspill-invocation"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (count) => ({
    staticTriggeredHitHitSequence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter(),
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "create-token",
              token: "runechant",
              controller: "controller",
              count,
            },
          ],
        },
      },
    },
    staticTriggeredDealtDamageDealtDamageDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
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
    },
  }),
});

export const {
  red: bloodspillInvocationRed,
  yellow: bloodspillInvocationYellow,
  blue: bloodspillInvocationBlue,
} = bloodspillInvocation.cards;
