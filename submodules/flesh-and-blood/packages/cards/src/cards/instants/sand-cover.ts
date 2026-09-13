import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sand-cover.generated.ts";
import { ward } from "../shared/keywords.ts";

export const sandCover = definePitchFamily(fabPitchFamilies["sand-cover"], {
  parameters: pitchMap({
    red: { wardAmount: 4, targetCount: 1 },
    yellow: { wardAmount: 3, targetCount: { type: "all" } },
    blue: { wardAmount: 2, targetCount: { type: "all" } },
  }),
  abilities: ({ wardAmount, targetCount }) => ({
    grantWard: {
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: ward(wardAmount),
      },
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["permanent"],
        filter: {
          typeBox: {
            subtypes: ["Ash"],
          },
        },
        count: targetCount,
      },
      duration: "this-turn",
    },
  }),
});

export const { red: sandCoverRed, yellow: sandCoverYellow, blue: sandCoverBlue } = sandCover.cards;
