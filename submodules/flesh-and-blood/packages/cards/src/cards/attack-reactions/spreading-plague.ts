import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/spreading-plague.generated.ts";

export const spreadingPlague = definePitchFamily(fabPitchFamilies["spreading-plague"], {
  abilities: () => ({
    createBloodrotForDefenders: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "bloodrot-pox",
        controller: "defending-hero",
        count: {
          type: "count",
          what: "cards-defending",
          per: "chain-link",
        },
      },
    },
  }),
});

export const { yellow: spreadingPlagueYellow } = spreadingPlague.cards;
