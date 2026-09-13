import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/frazzle.generated.ts";
export const frazzle = definePitchFamily(fabPitchFamilies["frazzle"], {
  parameters: pitchMap({
    red: { value1: 1, textValue1: 1 },
    yellow: { value1: 1, textValue1: 1 },
    blue: { value1: 1, textValue1: 1 },
  }),
  keywords: [fusion("Lightning")],
  abilities: ({ value1, textValue1: _textValue1 }) => ({
    resolutionHasStatusFusedReplacementModifyNumericCount: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "damage",
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: value1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: frazzleRed, yellow: frazzleYellow, blue: frazzleBlue } = frazzle.cards;
