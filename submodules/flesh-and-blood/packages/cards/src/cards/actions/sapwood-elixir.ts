import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sapwood-elixir.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sapwoodElixir = definePitchFamily(fabPitchFamilies["sapwood-elixir"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGetsNumber3Power: {
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
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
    destroyFrailtyTokenControlDoGainNumber1Life: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              name: "Frailty",
              typeBox: {
                metatypes: ["Token"],
              },
            },
            count: 1,
          },
        },
        then: {
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { red: sapwoodElixirRed } = sapwoodElixir.cards;
