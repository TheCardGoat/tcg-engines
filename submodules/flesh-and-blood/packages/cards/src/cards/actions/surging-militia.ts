import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/surging-militia.generated.ts";

export const surgingMilitia = definePitchFamily(fabPitchFamilies["surging-militia"], {
  abilities: () => ({
    continuousStaticModifyNumeric: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-defending",
          per: "chain-link",
          filter: {
            typeBox: {
              excludeTypes: ["Equipment"],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const {
  red: surgingMilitiaRed,
  yellow: surgingMilitiaYellow,
  blue: surgingMilitiaBlue,
} = surgingMilitia.cards;
