import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mordred-tide.generated.ts";

/** Model notes (hand-authored): until EOT, creating Runechants makes that many plus 1. */
export const mordredTide = definePitchFamily(fabPitchFamilies["mordred-tide"], {
  keywords: [goAgain],
  abilities: () => ({
    endTurnCreateOneMoreRunechantTokensInsteadCreateManyPlus1: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          creator: "controller",
          occurrences: "every",
          filter: {
            name: "Runechant",
            typeBox: {
              metatypes: ["Token"],
            },
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
  }),
});

export const { red: mordredTideRed } = mordredTide.cards;
