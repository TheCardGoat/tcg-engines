import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/skittering-sands.generated.ts";

export const skitteringSands = definePitchFamily(fabPitchFamilies["skittering-sands"], {
  parameters: pitchMap({ red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "transform",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Ash",
              },
              count: 1,
            },
            into: "an-aether-ashwing",
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: value1,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
  }),
});

export const {
  red: skitteringSandsRed,
  yellow: skitteringSandsYellow,
  blue: skitteringSandsBlue,
} = skitteringSands.cards;
