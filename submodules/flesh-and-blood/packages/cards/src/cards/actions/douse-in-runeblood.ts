import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/douse-in-runeblood.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const douseInRuneblood = definePitchFamily(fabPitchFamilies["douse-in-runeblood"], {
  abilities: () => ({
    whenAttacksCreateRunechantTokensEqualNumberNonAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "runechant",
              controller: "controller",
              count: {
                type: "count",
                what: "cards-played-this-turn",
                filter: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "count",
                  what: "created-this-way",
                },
                comparison: { op: "gte", value: 3 },
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
          ],
        },
      },
    },
  }),
});
export const { red: douseInRunebloodRed } = douseInRuneblood.cards;
