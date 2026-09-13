import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-focus.generated.ts";

export const blessingOfFocus = definePitchFamily(fabPitchFamilies["blessing-of-focus"], {
  parameters: pitchMap({
    red: { value1: 3, value2: 1, value3: 1, textValue1: 3 },
    yellow: { value1: 2, value2: 1, value3: 1, textValue1: 2 },
    blue: { value1: 1, value2: 1, value3: 1, textValue1: 1 },
  }),
  abilities: ({ value1, value2, value3, textValue1: _textValue1 }) => ({
    staticTriggeredStartPhaseStartPhaseSequence: {
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "opt",
              count: value1,
            },
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: value2,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "arsenal",
                      visibility: "face-up",
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "add-counter",
                    counter: {
                      kind: "named",
                      name: "aim",
                    },
                    count: value3,
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: blessingOfFocusRed,
  yellow: blessingOfFocusYellow,
  blue: blessingOfFocusBlue,
} = blessingOfFocus.cards;
