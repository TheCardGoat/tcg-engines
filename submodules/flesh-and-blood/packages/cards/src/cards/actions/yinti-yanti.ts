import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/yinti-yanti.generated.ts";

export const yintiYanti = definePitchFamily(fabPitchFamilies["yinti-yanti"], {
  abilities: () => ({
    whileStaticModifyNumeric: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          {
            type: "has-status",
            status: "attacking",
          },
          {
            type: "control-object",
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    whileStaticModifyNumericWhileStaticModifyNumeric: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          {
            type: "has-status",
            status: "defending",
          },
          {
            type: "control-object",
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: yintiYantiRed,
  yellow: yintiYantiYellow,
  blue: yintiYantiBlue,
} = yintiYanti.cards;
