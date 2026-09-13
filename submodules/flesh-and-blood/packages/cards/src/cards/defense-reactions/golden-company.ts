import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/golden-company.generated.ts";

export const goldenCompany = definePitchFamily(fabPitchFamilies["golden-company"], {
  abilities: () => ({
    destroyGoldAsAlternativeCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: {
            name: "Gold",
          },
        },
        optional: true,
      },
    },
  }),
});

export const {
  red: goldenCompanyRed,
  yellow: goldenCompanyYellow,
  blue: goldenCompanyBlue,
} = goldenCompany.cards;
