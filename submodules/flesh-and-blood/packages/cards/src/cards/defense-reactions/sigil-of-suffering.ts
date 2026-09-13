import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/sigil-of-suffering.generated.ts";

export const sigilOfSuffering = definePitchFamily(fabPitchFamilies["sigil-of-suffering"], {
  abilities: () => ({
    dealArcaneDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "attacking-hero",
        },
      },
    },
    gainDefenseAfterArcaneDamage: {
      kind: "resolution",
      condition: {
        type: "damage-dealt",
        damageType: "arcane",
        player: "controller",
        per: "turn",
        comparison: {
          op: "gte",
          value: 1,
        },
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

export const {
  red: sigilOfSufferingRed,
  yellow: sigilOfSufferingYellow,
  blue: sigilOfSufferingBlue,
} = sigilOfSuffering.cards;
