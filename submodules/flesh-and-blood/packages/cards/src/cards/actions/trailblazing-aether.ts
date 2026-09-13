import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/trailblazing-aether.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const trailblazingAether = definePitchFamily(fabPitchFamilies["trailblazing-aether"], {
  parameters: pitchMap({ red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamage: {
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
    resolutionGrantProperty: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: damage },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const {
  red: trailblazingAetherRed,
  yellow: trailblazingAetherYellow,
  blue: trailblazingAetherBlue,
} = trailblazingAether.cards;
