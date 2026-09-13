import { compareAmount } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bad-beats.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const badBeats = definePitchFamily(fabPitchFamilies["bad-beats"], {
  parameters: pitchMap({
    red: { op: "gte" as const, threshold: 4, result: "a 4, 5, or 6" },
    yellow: { op: "gte" as const, threshold: 5, result: "a 5 or 6" },
    blue: { op: "eq" as const, threshold: 6, result: "a 6" },
  }),
  keywords: [goAgain],
  abilities: ({ op, threshold }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "roll",
            sides: 6,
          },
          {
            type: "conditional",
            condition: compareAmount({ type: "roll-result" }, { op, value: threshold }),
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 5,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    supertypes: ["Brute"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: badBeatsRed, yellow: badBeatsYellow, blue: badBeatsBlue } = badBeats.cards;
