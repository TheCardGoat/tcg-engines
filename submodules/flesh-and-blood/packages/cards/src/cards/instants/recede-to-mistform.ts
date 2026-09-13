import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/recede-to-mistform.generated.ts";

export const recedeToMistform = definePitchFamily(fabPitchFamilies["recede-to-mistform"], {
  abilities: () => ({
    chooseXEquipmentCloakedHaveEquippedTurnThemFace: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: [
                "equipment-head",
                "equipment-chest",
                "equipment-arms",
                "equipment-legs",
                "weapon",
              ],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                },
                hasKeyword: "cloaked",
              },
              count: {
                type: "any-number",
              },
            },
            outputBinding: "it",
          },
          {
            type: "turn-face-down",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: recedeToMistformBlue } = recedeToMistform.cards;
