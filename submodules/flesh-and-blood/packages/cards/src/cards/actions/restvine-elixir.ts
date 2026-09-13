import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restvine-elixir.generated.ts";

export const restvineElixir = definePitchFamily(fabPitchFamilies["restvine-elixir"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGets3Power: {
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
    destroyInertiaTokenGain1Life: {
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
              name: "Inertia",
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

export const { red: restvineElixirRed } = restvineElixir.cards;
