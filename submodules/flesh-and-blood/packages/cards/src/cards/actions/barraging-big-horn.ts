import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/barraging-big-horn.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const barragingBigHorn = definePitchFamily(fabPitchFamilies["barraging-big-horn"], {
  keywords: [],
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
    staticWhileHasStatusDefendedByFewerThan2Non: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defended-by-fewer-than-2-non-equipment-cards",
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
  red: barragingBigHornRed,
  yellow: barragingBigHornYellow,
  blue: barragingBigHornBlue,
} = barragingBigHorn.cards;
