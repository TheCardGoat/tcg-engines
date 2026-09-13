import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sonata-galaxia.generated.ts";
import { goAgain } from "../shared/keywords.ts";

/**
 * Model notes (hand-authored): search filter is a Runeblade Aura with cost ≤ X,
 * not a name string. Printed cost is X (catalog cost field is numeric-only).
 */
export const sonataGalaxia = definePitchFamily(fabPitchFamilies["sonata-galaxia"], {
  keywords: [goAgain],
  abilities: () => ({
    costsResourceLessPlayForEachRunechantControl: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Runechant",
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
    searchDeckForRunebladeAuraWithCostXLessPutIntoArena: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              typeBox: {
                supertypes: ["Runeblade"],
                subtypes: ["Aura"],
              },
              cost: {
                op: "lte",
                value: { type: "x" },
              },
            },
            mayFail: true,
            to: {
              zone: "permanent",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});

export const { red: sonataGalaxiaRed } = sonataGalaxia.cards;
