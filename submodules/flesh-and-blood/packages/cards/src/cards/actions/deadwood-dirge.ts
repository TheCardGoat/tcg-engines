import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/deadwood-dirge.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const deadwoodDirge = definePitchFamily(fabPitchFamilies["deadwood-dirge"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (count) => ({
    resolutionIfDoDestroyCreateTokenRunechant: {
      kind: "resolution",
      effect: {
        type: "if-you-do",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
        then: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
          count,
        },
      },
    },
  }),
});
export const {
  red: deadwoodDirgeRed,
  yellow: deadwoodDirgeYellow,
  blue: deadwoodDirgeBlue,
} = deadwoodDirge.cards;
