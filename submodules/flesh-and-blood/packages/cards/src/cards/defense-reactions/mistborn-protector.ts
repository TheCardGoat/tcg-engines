import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/mistborn-protector.generated.ts";

export const mistbornProtector = definePitchFamily(fabPitchFamilies["mistborn-protector"], {
  abilities: () => ({
    gainDefenseAfterCreatingCard: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          { type: "has-status", status: "defending" },
          { type: "performed-this-turn", event: "create-card", player: "self" },
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
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: mistbornProtectorBlue } = mistbornProtector.cards;
