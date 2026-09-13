import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/rake-over-the-coals.generated.ts";

export const rakeOverTheCoals = definePitchFamily(fabPitchFamilies["rake-over-the-coals"], {
  abilities: () => ({
    draconicAttacksGet1Turn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: rakeOverTheCoalsRed } = rakeOverTheCoals.cards;
