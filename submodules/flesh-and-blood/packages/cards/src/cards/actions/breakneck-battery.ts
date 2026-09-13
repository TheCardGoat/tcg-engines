import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/breakneck-battery.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const breakneckBattery = definePitchFamily(fabPitchFamilies["breakneck-battery"], {
  abilities: () => ({
    staticPlay: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          random: true,
        },
      },
    },
    resolutionBindingMatchesGrantProperty: {
      kind: "resolution",
      condition: {
        type: "binding-matches",
        binding: "discardedCard",
        filter: {
          numeric: [{ property: "power", basis: "current", comparison: { op: "gte", value: 6 } }],
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
    },
  }),
});

export const {
  red: breakneckBatteryRed,
  yellow: breakneckBatteryYellow,
  blue: breakneckBatteryBlue,
} = breakneckBattery.cards;
