import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/freewheeling-renegades.generated.ts";

export const freewheelingRenegades = definePitchFamily(fabPitchFamilies["freewheeling-renegades"], {
  abilities: () => ({
    defendedByAction: {
      kind: "static",
      staticKind: "while",
      condition: { type: "has-status", status: "defended-by-action" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 2,
        target: { selector: "self" },
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: freewheelingRenegadesRed,
  yellow: freewheelingRenegadesYellow,
  blue: freewheelingRenegadesBlue,
} = freewheelingRenegades.cards;
