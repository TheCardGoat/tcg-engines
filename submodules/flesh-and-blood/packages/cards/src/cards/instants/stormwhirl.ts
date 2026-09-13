import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/stormwhirl.generated.ts";

export const stormwhirl = definePitchFamily(fabPitchFamilies["stormwhirl"], {
  abilities: () => ({
    mayDestroyLightningFlowControlRatherThanPayS: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: {
            name: "Lightning Flow",
          },
        },
        optional: true,
      },
    },
    targetLightningAttackGetsGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { blue: stormwhirlBlue } = stormwhirl.cards;
