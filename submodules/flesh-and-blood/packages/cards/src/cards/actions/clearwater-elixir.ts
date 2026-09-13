import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/clearwater-elixir.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const clearwaterElixir = definePitchFamily(fabPitchFamilies["clearwater-elixir"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGets3: {
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
    mayDestroyBloodrotPoxTokenControlIfDoGain: {
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
              name: "Bloodrot Pox",
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
export const { red: clearwaterElixirRed } = clearwaterElixir.cards;
