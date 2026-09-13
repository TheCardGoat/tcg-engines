import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rousing-aether.generated.ts";

export const rousingAether = definePitchFamily(fabPitchFamilies["rousing-aether"], {
  parameters: { red: { damage: 4 }, yellow: { damage: 3 }, blue: { damage: 2 } },
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
    replacementDamageModifyNumericCountPermanentThisTurn: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "damage",
          damageType: "arcane",
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            hasStatus: "arcane-damage-effect",
          },
        },
      },
    },
  }),
});

export const {
  red: rousingAetherRed,
  yellow: rousingAetherYellow,
  blue: rousingAetherBlue,
} = rousingAether.cards;
