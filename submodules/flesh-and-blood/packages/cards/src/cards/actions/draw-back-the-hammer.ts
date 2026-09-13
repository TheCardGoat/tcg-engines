import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/draw-back-the-hammer.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const drawBackTheHammer = definePitchFamily(fabPitchFamilies["draw-back-the-hammer"], {
  keywords: [goAgain],
  abilities: () => ({
    nextMechanologistAttackTurnGets4: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Mechanologist"],
            },
          },
        },
      },
    },
    mayGunControl: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "untap",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Gun"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: drawBackTheHammerRed } = drawBackTheHammer.cards;
