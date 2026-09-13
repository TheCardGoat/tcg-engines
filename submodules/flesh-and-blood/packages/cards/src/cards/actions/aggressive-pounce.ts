import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aggressive-pounce.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): go again is conditional on having intimidated this turn, not a printed keyword. */
export const aggressivePounce = definePitchFamily(fabPitchFamilies["aggressive-pounce"], {
  // Go again is conditional (intimidate this turn) — not a printed keyword.
  keywords: [],
  abilities: () => ({
    resolutionPerformedTurnIntimidateOpponentGrantProperty: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "intimidate-an-opponent",
        player: "controller",
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
  red: aggressivePounceRed,
  yellow: aggressivePounceYellow,
  blue: aggressivePounceBlue,
} = aggressivePounce.cards;
