import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sadistic-scowl.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sadisticScowl = definePitchFamily(fabPitchFamilies["sadistic-scowl"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGetsNumber5Power: {
      kind: "resolution",
      effect: {
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
              subtypes: ["Attack"],
            },
          },
        },
      },
      label: {
        name: "intimidate",
      },
    },
    intimidateHero: {
      kind: "resolution",
      effect: {
        type: "intimidate",
        target: "any",
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { red: sadisticScowlRed } = sadisticScowl.cards;
