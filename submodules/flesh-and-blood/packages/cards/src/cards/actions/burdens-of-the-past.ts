import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/burdens-of-the-past.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const burdensOfThePast = definePitchFamily(fabPitchFamilies["burdens-of-the-past"], {
  keywords: [goAgain],
  abilities: () => ({
    untilEndTurnTargetHeroCanTPlayDefense: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        subject: { selector: "any-hero" },
        filter: {
          typeBox: {
            types: ["Defense Reaction"],
          },
          hasStatus: "same-name-as-a-card-in-their-graveyard",
        },
        duration: "this-turn",
      },
    },
    ifThereAre10MoreDefenseReactionTheirGraveyard: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "opponent",
        filter: {
          typeBox: {
            types: ["Defense Reaction"],
          },
        },
        comparison: {
          op: "gte",
          value: 10,
        },
      },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});
export const { blue: burdensOfThePastBlue } = burdensOfThePast.cards;
