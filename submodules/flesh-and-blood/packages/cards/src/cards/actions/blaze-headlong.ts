import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blaze-headlong.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): go again is only granted when another red card was played this turn. */
export const blazeHeadlong = definePitchFamily(fabPitchFamilies["blaze-headlong"], {
  abilities: () => ({
    ifVePlayedAnotherRedTurnGetsGoAgain: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-another-red-card",
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
export const { red: blazeHeadlongRed } = blazeHeadlong.cards;
