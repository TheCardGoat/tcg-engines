import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/regurgitating-slog.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const regurgitatingSlog = definePitchFamily(fabPitchFamilies["regurgitating-slog"], {
  keywords: [],
  abilities: () => ({
    playBanishSloggismGrantPropertyThisTurn: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 1,
          filter: {
            name: "Sloggism",
          },
        },
        optional: true,
        then: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: dominate,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: regurgitatingSlogRed,
  yellow: regurgitatingSlogYellow,
  blue: regurgitatingSlogBlue,
} = regurgitatingSlog.cards;
