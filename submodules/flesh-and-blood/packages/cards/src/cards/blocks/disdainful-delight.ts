import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/disdainful-delight.generated.ts";

export const disdainfulDelight = definePitchFamily(fabPitchFamilies["disdainful-delight"], {
  abilities: () => ({
    booedDefense: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          { type: "has-status", status: "defending" },
          { type: "performed-this-turn", event: "booed", player: "controller" },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: { selector: "self" },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: disdainfulDelightYellow } = disdainfulDelight.cards;
