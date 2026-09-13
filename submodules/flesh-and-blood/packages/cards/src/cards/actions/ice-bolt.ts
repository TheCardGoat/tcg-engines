import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ice-bolt.generated.ts";

export const iceBolt = definePitchFamily(fabPitchFamilies["ice-bolt"], {
  parameters: { red: { damage: 5 }, yellow: { damage: 4 }, blue: { damage: 3 } },
  abilities: ({ damage }) => ({
    dealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
  }),
});

export const { red: iceBoltRed, yellow: iceBoltYellow, blue: iceBoltBlue } = iceBolt.cards;
