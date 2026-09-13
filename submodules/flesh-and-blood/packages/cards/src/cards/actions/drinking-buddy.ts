import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/drinking-buddy.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const drinkingBuddy = definePitchFamily(fabPitchFamilies["drinking-buddy"], {
  abilities: () => ({
    whenAttacksEachHeroMaySearchTheirDeckItem: {
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
              type: "for-each",
              target: {
                selector: "each-hero",
              },
              effect: {
                type: "optional",
                effect: {
                  type: "search",
                  player: "iteration-subject",
                  zones: ["deck"],
                  filter: {
                    and: [
                      {
                        typeBox: {
                          subtypes: ["Item"],
                        },
                      },
                      {
                        or: [{ nameContains: "Potion" }, { nameContains: "Brew" }],
                      },
                    ],
                  },
                  mayFail: true,
                  to: {
                    zone: "permanent",
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
                  what: "put-into-arena-this-way",
                },
                comparison: {
                  op: "gte",
                  value: 2,
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
          ],
        },
      },
    },
  }),
});
export const { red: drinkingBuddyRed } = drinkingBuddy.cards;
