import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/unwavering-resolve.generated.ts";
import { goAgain } from "../shared/keywords.ts";

/**
 * Printed go again is only the 3+ defender grant — not a keyword.
 * Both clauses are always-checking while-statics (not resolution layers).
 */
export const unwaveringResolve = definePitchFamily(fabPitchFamilies["unwavering-resolve"], {
  abilities: () => ({
    haveNoInDeckGetsNumber4Power: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "zone-count",
        zone: "deck",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    defendedByNumber3MoreGetsGoAgain: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "cards-defending" },
        comparison: { op: "gte", value: 3 },
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

export const { red: unwaveringResolveRed } = unwaveringResolve.cards;
