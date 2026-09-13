import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/darling-of-the-crowd.generated.ts";

export const darlingOfTheCrowd = definePitchFamily(fabPitchFamilies["darling-of-the-crowd"], {
  abilities: () => ({
    cheeredDefense: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          { type: "has-status", status: "defending" },
          { type: "performed-this-turn", event: "cheered", player: "controller" },
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

export const { yellow: darlingOfTheCrowdYellow } = darlingOfTheCrowd.cards;
