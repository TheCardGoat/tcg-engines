import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/wax-on.generated.ts";

export const waxOn = definePitchFamily(fabPitchFamilies["wax-on"], {
  abilities: () => ({
    gainDefenseAgainstZeroCostAttack: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defending-attack-action-card-with-cost-0",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const { red: waxOnRed, yellow: waxOnYellow, blue: waxOnBlue } = waxOn.cards;
