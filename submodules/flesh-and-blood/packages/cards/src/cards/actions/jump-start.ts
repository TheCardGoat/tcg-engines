import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/jump-start.generated.ts";
import { boost } from "../shared/keywords.ts";

export const jumpStart = definePitchFamily(fabPitchFamilies["jump-start"], {
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

export const { red: jumpStartRed, yellow: jumpStartYellow, blue: jumpStartBlue } = jumpStart.cards;
