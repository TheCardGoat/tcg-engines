import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rake-the-embers.generated.ts";

export const rakeTheEmbers = definePitchFamily(fabPitchFamilies["rake-the-embers"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    sequenceCreateTokenAshTransformAshUpToTransform: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "ash",
            controller: "controller",
          },
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
              count: {
                type: "up-to",
                amount: value1,
              },
            },
            into: "aether-ashwing",
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
  red: rakeTheEmbersRed,
  yellow: rakeTheEmbersYellow,
  blue: rakeTheEmbersBlue,
} = rakeTheEmbers.cards;
