import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spill-blood.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const spillBlood = definePitchFamily(fabPitchFamilies["spill-blood"], {
  keywords: [goAgain],
  abilities: () => ({
    axesControlGainNumber2PowerDominateUntilEndTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  subtypes: ["Axe"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  subtypes: ["Axe"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const { red: spillBloodRed } = spillBlood.cards;
