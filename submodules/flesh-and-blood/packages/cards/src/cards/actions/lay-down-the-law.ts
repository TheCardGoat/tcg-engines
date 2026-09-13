import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lay-down-the-law.generated.ts";

export const layDownTheLaw = definePitchFamily(fabPitchFamilies["lay-down-the-law"], {
  abilities: () => ({
    ability13MorePowerNonEquipmentGet1DefenseDefending: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "attack-power",
        comparison: { op: "gte", value: 13 },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              excludeTypes: ["Equipment"],
            },
            defending: true,
          },
          count: {
            type: "all",
          },
        },
        duration: "this-chain-link",
      },
      label: {
        name: "tower",
      },
    },
  }),
});

export const { red: layDownTheLawRed } = layDownTheLaw.cards;
