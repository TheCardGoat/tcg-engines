import { bloodDebt, goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soul-cleaver.generated.ts";

export const soulCleaver = definePitchFamily(fabPitchFamilies["soul-cleaver"], {
  keywords: [bloodDebt],
  abilities: () => ({
    resolutionGrantProperty: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "soul",
        player: "defending-hero",
        comparison: { op: "gte", value: 1 },
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

export const {
  red: soulCleaverRed,
  yellow: soulCleaverYellow,
  blue: soulCleaverBlue,
} = soulCleaver.cards;
