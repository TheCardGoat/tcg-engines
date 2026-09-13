import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rev-up.generated.ts";
import { boost } from "../shared/keywords.ts";

export const revUp = definePitchFamily(fabPitchFamilies["rev-up"], {
  keywords: [boost],
  abilities: () => ({
    playControlObjectHyperDriverResources: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "control-object",
        filter: {
          name: "Hyper Driver",
        },
      },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
      },
    },
  }),
});

export const { red: revUpRed, yellow: revUpYellow, blue: revUpBlue } = revUp.cards;
