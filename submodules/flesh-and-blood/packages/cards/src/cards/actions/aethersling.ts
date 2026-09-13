import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aethersling.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): deals 4 arcane to a hero (printed any target); go again only after the optional hero tap. */
export const aethersling = definePitchFamily(fabPitchFamilies["aethersling"], {
  keywords: [],
  abilities: () => ({
    deal4ArcaneDamageAnyTarget: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 4,
        target: {
          selector: "any-hero",
        },
      },
    },
    ifDealsDamageMayHeroIfDoGetsGo: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "this-dealt-damage",
      },
      effect: {
        type: "optional",
        effect: {
          type: "tap",
          target: {
            selector: "controller",
          },
        },
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
export const { red: aetherslingRed } = aethersling.cards;
