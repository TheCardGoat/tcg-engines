import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flicker-wisp.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const flickerWisp = definePitchFamily(fabPitchFamilies["flicker-wisp"], {
  keywords: [fusion("Lightning"), goAgain],
  abilities: () => ({
    ifFlickerWispWasFusedUntilEndTurnAction: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "damage",
          damageType: "arcane",
          filter: {
            typeBox: {
              types: ["Action"],
            },
            hasStatus: "controller-effect",
          },
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
    deal1ArcaneDamageTargetHero: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "any-hero",
        },
      },
    },
  }),
});
export const { yellow: flickerWispYellow } = flickerWisp.cards;
