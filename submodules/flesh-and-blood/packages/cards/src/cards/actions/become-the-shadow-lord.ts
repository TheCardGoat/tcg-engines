import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/become-the-shadow-lord.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const becomeTheShadowLord = definePitchFamily(fabPitchFamilies["become-the-shadow-lord"], {
  keywords: [goAgain],
  abilities: () => ({
    banishFromHandIfSRunebladeCreateRunechantToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
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
                typeBox: {
                  supertypes: ["Runeblade"],
                },
              },
            },
            then: {
              type: "create-token",
              token: "runechant",
              controller: "controller",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  supertypes: ["Shadow"],
                },
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
export const { blue: becomeTheShadowLordBlue } = becomeTheShadowLord.cards;
