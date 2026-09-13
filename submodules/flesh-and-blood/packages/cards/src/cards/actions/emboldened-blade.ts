import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/emboldened-blade.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const emboldenedBlade = definePitchFamily(fabPitchFamilies["emboldened-blade"], {
  keywords: [goAgain],
  abilities: () => ({
    turnFaceDownAnyArsenalFaceUpIfS: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "turn-face-up",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["arsenal"],
              filter: {
                hasStatus: "face-down",
              },
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
                typeBox: { types: ["Defense Reaction"] },
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
                  appliesTo: {
                    next: {
                      typeBox: {
                        types: ["Weapon"],
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  }),
});
export const { blue: emboldenedBladeBlue } = emboldenedBlade.cards;
