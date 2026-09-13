import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blazing-aether.generated.ts";

export const blazingAether = definePitchFamily(fabPitchFamilies["blazing-aether"], {
  keywords: [
    {
      name: "specialization",
      hero: "Kano",
    },
  ],
  abilities: () => ({
    dealXArcaneDamageTargetHeroWhereXIs: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: {
          type: "count",
          what: "damage-dealt",
          per: "turn",
          damageType: "arcane",
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero"],
          count: 1,
        },
      },
    },
  }),
});
export const { red: blazingAetherRed } = blazingAether.cards;
