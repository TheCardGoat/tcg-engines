import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bingo.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const bingo = definePitchFamily(fabPitchFamilies["bingo"], {
  keywords: [goAgain],
  abilities: () => ({
    whenBingoHitsHeroTheyRevealFromTheirHand: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["hand"],
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: attackActionFilter(),
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
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
              },
              then: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: bingoRed } = bingo.cards;
