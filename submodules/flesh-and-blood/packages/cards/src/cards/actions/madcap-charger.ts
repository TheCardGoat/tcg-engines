import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/madcap-charger.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const madcapCharger = definePitchFamily(fabPitchFamilies["madcap-charger"], {
  keywords: [goAgain],
  abilities: () => ({
    playDiscard: {
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
    continuousBindingMatchesGrantPropertyPermanent: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "binding-matches",
        binding: "discardedCard",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
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
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: madcapChargerRed,
  yellow: madcapChargerYellow,
  blue: madcapChargerBlue,
} = madcapCharger.cards;
