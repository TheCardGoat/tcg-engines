import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/brand-with-cinderclaw.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const brandWithCinderclaw = definePitchFamily(fabPitchFamilies["brand-with-cinderclaw"], {
  keywords: [goAgain],
  abilities: () => ({
    resolutionGrantProperty: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "supertype",
          value: "Draconic",
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-combat-chain",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});

export const {
  red: brandWithCinderclawRed,
  yellow: brandWithCinderclawYellow,
  blue: brandWithCinderclawBlue,
} = brandWithCinderclaw.cards;
