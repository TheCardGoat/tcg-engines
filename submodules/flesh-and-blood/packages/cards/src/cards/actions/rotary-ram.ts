import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rotary-ram.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const rotaryRam = definePitchFamily(fabPitchFamilies["rotary-ram"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Mechanologist"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
    performedThisTurnBoostMoveCard: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "boost", player: "controller" },
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
    },
  }),
});

export const { red: rotaryRamRed, yellow: rotaryRamYellow, blue: rotaryRamBlue } = rotaryRam.cards;
