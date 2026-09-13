import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/boo-resident-spook.generated.ts";

import { spellvoid, wateryGrave } from "../shared/keywords.ts";

export const booResidentSpook = definePitchFamily(fabPitchFamilies["boo-resident-spook"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    ifIsUntappedGetsSpellvoid2: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "untapped",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: spellvoid(2),
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const { yellow: booResidentSpookYellow } = booResidentSpook.cards;
