import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/painful-passage.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const painfulPassage = definePitchFamily(fabPitchFamilies["painful-passage"], {
  keywords: [goAgain],
  abilities: () => ({
    banishAttackActionHandGets3PowerGoAgainEndTurn: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: attackActionFilter(),
            count: 1,
          },
          outputBinding: "it",
        },
        then: {
          type: "choice",
          options: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { red: painfulPassageRed } = painfulPassage.cards;
