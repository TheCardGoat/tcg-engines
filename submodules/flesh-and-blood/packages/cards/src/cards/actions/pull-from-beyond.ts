import { goAgain, opt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pull-from-beyond.generated.ts";

export const pullFromBeyond = definePitchFamily(fabPitchFamilies["pull-from-beyond"], {
  parameters: {
    red: { color: "red" },
    yellow: { color: "yellow" },
    blue: { color: "blue" },
  },
  keywords: [opt(2), goAgain],
  abilities: ({ color }) => ({
    sequenceOptBanishConditionalBindingMatchesCreateTokenGateToIArathael: {
      kind: "resolution",
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "opt",
            count: 2,
          },
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                color: [color],
              },
            },
            then: {
              type: "create-token",
              token: "gate-to-i-arathael",
              controller: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: pullFromBeyondRed,
  yellow: pullFromBeyondYellow,
  blue: pullFromBeyondBlue,
} = pullFromBeyond.cards;
