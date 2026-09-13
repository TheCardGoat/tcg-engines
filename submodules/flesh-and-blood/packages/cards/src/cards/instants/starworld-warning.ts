import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/starworld-warning.generated.ts";

export const starworldWarning = definePitchFamily(fabPitchFamilies["starworld-warning"], {
  abilities: () => ({
    create2LightningFlowTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
        count: 2,
      },
    },
  }),
});

export const { yellow: starworldWarningYellow } = starworldWarning.cards;
