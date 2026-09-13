import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shaden-scream.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shadenScream = definePitchFamily(fabPitchFamilies["shaden-scream"], {
  parameters: pitchMap({
    red: { powerBonus: 5 },
    yellow: { powerBonus: 4 },
    blue: { powerBonus: 3 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: 1,
          random: true,
        },
      },
    },
    resolutionModifyNumeric: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: powerBonus,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            or: [
              {
                typeBox: {
                  supertypes: ["Brute"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Shadow"],
                },
              },
            ],
          },
        },
      },
    },
  }),
});

export const {
  red: shadenScreamRed,
  yellow: shadenScreamYellow,
  blue: shadenScreamBlue,
} = shadenScream.cards;
