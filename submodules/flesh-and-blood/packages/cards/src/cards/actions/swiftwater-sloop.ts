import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swiftwater-sloop.generated.ts";

export const swiftwaterSloop = definePitchFamily(fabPitchFamilies["swiftwater-sloop"], {
  abilities: () => ({
    gainGoAgainIfTwoBlueCardsPitched: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "pitch",
        player: "controller",
        filter: {
          color: ["blue"],
        },
        comparison: {
          op: "gte",
          value: 2,
        },
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
      label: {
        name: "high-tide",
      },
    },
  }),
});
export const {
  red: swiftwaterSloopRed,
  yellow: swiftwaterSloopYellow,
  blue: swiftwaterSloopBlue,
} = swiftwaterSloop.cards;
