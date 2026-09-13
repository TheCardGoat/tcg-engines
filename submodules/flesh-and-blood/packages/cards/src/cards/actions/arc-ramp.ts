import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arc-ramp.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const arcRamp = definePitchFamily(fabPitchFamilies["arc-ramp"], {
  keywords: pitchMap({
    red: [{ name: "amp", value: 3 }],
    yellow: [{ name: "amp", value: 2 }],
    blue: [{ name: "amp", value: 1 }],
  }),
  abilities: (_parameter, { pitch }) => ({
    resolutionAmp: {
      kind: "resolution",
      effect: {
        type: "amp",
        amount: 4 - Number(pitch),
      },
    },
    resolutionOptionalDestroyGrantProperty: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              name: "Lightning Flow",
            },
            count: 1,
          },
        },
        then: {
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
    },
  }),
});

export const { red: arcRampRed, yellow: arcRampYellow, blue: arcRampBlue } = arcRamp.cards;
