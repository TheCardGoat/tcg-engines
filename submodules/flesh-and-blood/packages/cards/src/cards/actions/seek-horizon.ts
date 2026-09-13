import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seek-horizon.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const seekHorizon = definePitchFamily(fabPitchFamilies["seek-horizon"], {
  abilities: () => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "move-to-deck",
          from: "hand",
          position: "top",
          count: 1,
        },
        optional: true,
        then: {
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
    },
  }),
});

export const {
  red: seekHorizonRed,
  yellow: seekHorizonYellow,
  blue: seekHorizonBlue,
} = seekHorizon.cards;
