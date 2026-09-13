import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tear-through-the-portal.generated.ts";

export const tearThroughThePortal = definePitchFamily(fabPitchFamilies["tear-through-the-portal"], {
  parameters: pitchMap({
    red: { color: "red" },
    yellow: { color: "yellow" },
    blue: { color: "blue" },
  }),
  keywords: [goAgain],
  abilities: ({ color }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-card",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["banished"],
              filter: {
                color: [color],
                typeBox: {
                  types: ["Action"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const {
  red: tearThroughThePortalRed,
  yellow: tearThroughThePortalYellow,
  blue: tearThroughThePortalBlue,
} = tearThroughThePortal.cards;
