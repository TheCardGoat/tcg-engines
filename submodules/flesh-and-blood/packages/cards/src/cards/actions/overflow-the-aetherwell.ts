import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overflow-the-aetherwell.generated.ts";

export const overflowTheAetherwell = definePitchFamily(
  fabPitchFamilies["overflow-the-aetherwell"],
  {
    parameters: { red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } },
    abilities: ({ damage }) => ({
      dealDamage: {
        kind: "resolution",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: damage,
          target: {
            selector: "any-hero",
          },
        },
      },
      sourceDamageDealtGainResourcesSurge: {
        kind: "resolution",
        condition: {
          type: "source-damage-dealt",
          per: "turn",
          comparison: { op: "gt", value: damage },
        },
        effect: {
          type: "gain-resources",
          amount: 2,
        },
        label: {
          name: "surge",
        },
      },
    }),
  },
);

export const {
  red: overflowTheAetherwellRed,
  yellow: overflowTheAetherwellYellow,
  blue: overflowTheAetherwellBlue,
} = overflowTheAetherwell.cards;
