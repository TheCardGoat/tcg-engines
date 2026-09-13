import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/absorb-in-aether.generated.ts";

export const absorbInAether = definePitchFamily(fabPitchFamilies["absorb-in-aether"], {
  abilities: () => ({
    increaseNextArcaneDamage: {
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
          amount: 2,
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
  red: absorbInAetherRed,
  yellow: absorbInAetherYellow,
  blue: absorbInAetherBlue,
} = absorbInAether.cards;
