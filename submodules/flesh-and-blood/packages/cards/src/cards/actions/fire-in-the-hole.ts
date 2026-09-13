import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fire-in-the-hole.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const fireInTheHole = definePitchFamily(fabPitchFamilies["fire-in-the-hole"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGets3: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
    mayBowControl: {
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
                subtypes: ["Bow"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: fireInTheHoleRed } = fireInTheHole.cards;
