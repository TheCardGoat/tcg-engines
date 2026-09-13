import { goAgain, overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/monkey-powder.generated.ts";

export const monkeyPowder = definePitchFamily(fabPitchFamilies["monkey-powder"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGets1PowerOverpower: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
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
                  subtypes: ["Arrow"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: overpower,
            },
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
        ],
      },
    },
    draw: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { red: monkeyPowderRed } = monkeyPowder.cards;
