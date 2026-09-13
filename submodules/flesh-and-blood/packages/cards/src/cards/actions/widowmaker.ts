import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/widowmaker.generated.ts";

export const widowmaker = definePitchFamily(fabPitchFamilies["widowmaker"], {
  parameters: pitchMap({
    red: { value1: 3, textValue1: 2, textValue2: 3 },
    yellow: { value1: 3, textValue1: 2, textValue2: 3 },
    blue: { value1: 3, textValue1: 2, textValue2: 3 },
  }),
  abilities: ({ value1, textValue1: _textValue1, textValue2: _textValue2 }) => ({
    resolutionRuleModification: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "defend",
        filter: {
          typeBox: { types: ["Defense Reaction"] },
        },
        duration: "this-chain-link",
      },
    },
    continuousStaticModifyNumeric: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "defended-by-fewer-than-2-cards",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: widowmakerRed,
  yellow: widowmakerYellow,
  blue: widowmakerBlue,
} = widowmaker.cards;
