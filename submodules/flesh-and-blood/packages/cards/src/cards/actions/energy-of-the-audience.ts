import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/energy-of-the-audience.generated.ts";

export const energyOfTheAudience = definePitchFamily(fabPitchFamilies["energy-of-the-audience"], {
  abilities: () => ({
    ifHaveLessThanEachOtherHeroGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "life-comparison",
        player: "self",
        vs: "each-other-hero",
        op: "lt",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
            hasKeyword: "suspense",
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { yellow: energyOfTheAudienceYellow } = energyOfTheAudience.cards;
