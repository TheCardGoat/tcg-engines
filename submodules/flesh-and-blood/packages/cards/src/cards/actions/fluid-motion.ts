import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fluid-motion.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const fluidMotion = definePitchFamily(fabPitchFamilies["fluid-motion"], {
  abilities: () => ({
    ifVeCreatedTurnGetsGoAgain: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "create-card",
        player: "self",
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
    },
  }),
});
export const { blue: fluidMotionBlue } = fluidMotion.cards;
