import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/painful-premonition.generated.ts";

export const painfulPremonition = definePitchFamily(fabPitchFamilies["painful-premonition"], {
  parameters: { red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } },
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
    hasStatusThisDealtDamageCreateTokenSigilOfFate: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "this-dealt-damage",
      },
      effect: {
        type: "create-token",
        token: "sigil-of-fate",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: painfulPremonitionRed,
  yellow: painfulPremonitionYellow,
  blue: painfulPremonitionBlue,
} = painfulPremonition.cards;
