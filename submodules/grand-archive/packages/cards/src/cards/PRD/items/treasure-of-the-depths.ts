import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const treasureOfTheDepths: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4Kxe6pSt6C",
  slug: "treasure-of-the-depths",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4Kxe6pSt6C:face:default",
      catalogId: "4Kxe6pSt6C",
      name: "Treasure of the Depths",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Deluge 3 — At the beginning of your end phase, if there are three or more water element cards in your graveyard and there are less than three refinement counters on Treasure of the Depths, put a refinement counter on Treasure of the Depths.\n\n(3), REST: Draw a card into your memory. Activate this ability only if there are three or more refinement counters on Treasure of the Depths.",
      abilities: [
        {
          id: "4Kxe6pSt6C-a1",
          kind: "triggered",
          text: "Deluge 3 — At the beginning of your end phase, if there are three or more water element cards in your graveyard and there are less than three refinement counters on Treasure of the Depths, put a refinement counter on Treasure of the Depths.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "all",
              conditions: [
                {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["graveyard"],
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["WATER"],
                        },
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "refinement",
                      },
                    },
                    operator: "lt",
                    right: 3,
                  },
                },
              ],
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "refinement",
              },
              amount: 1,
            },
          },
          label: {
            name: "Deluge 3",
          },
        },
        {
          id: "4Kxe6pSt6C-a2",
          kind: "activated",
          text: "(3), REST: Draw a card into your memory. Activate this ability only if there are three or more refinement counters on Treasure of the Depths.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default treasureOfTheDepths;
