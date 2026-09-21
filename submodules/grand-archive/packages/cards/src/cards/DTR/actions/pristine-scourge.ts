import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pristineScourge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kugriwszxr",
  slug: "pristine-scourge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kugriwszxr:face:default",
      catalogId: "kugriwszxr",
      name: "Pristine Scourge",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Ciel Bonus] This card costs 1 less to activate for each of up to two omens you have. \n\nLook at target opponent's memory and discard a card from among them. If you have five or more omens with different reserve costs, discard an additional card from among them.\n",
      abilities: [
        {
          id: "kugriwszxr-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] This card costs 1 less to activate for each of up to two omens you have.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "minimum",
                operands: [
                  {
                    kind: "player-property",
                    player: "controller",
                    property: "omens",
                  },
                  2,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "kugriwszxr-a2",
          kind: "card-resolution",
          text: "Look at target opponent's memory and discard a card from among them. If you have five or more omens with different reserve costs, discard an additional card from among them.",
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "inspected-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "discard",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "discarded-opponent-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      distinctBy: "reserve-cost",
                      collection: {
                        zones: ["banishment"],
                        player: "controller",
                        filter: {
                          kind: "has-counter",
                          counter: "omen",
                        },
                      },
                    },
                    operator: "gte",
                    right: 5,
                  },
                },
                then: {
                  kind: "discard",
                  player: {
                    binding: "target-opponent",
                  },
                  selection: {
                    id: "additional-discarded-opponent-memory",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: {
                        binding: "target-opponent",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default pristineScourge;
