import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const idleFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qiv63tpshe",
  slug: "idle-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "qiv63tpshe:face:default",
      catalogId: "qiv63tpshe",
      name: "Idle Fatestone",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Look at the top four cards of your deck and then put them back in any order. \n[Guo Jia Bonus] [REST], (2): Reveal the top card of your deck. If that card's reserve cost is even, put a buff counter on Idle Fatestone. Otherwise, transform Idle Fatestone. (Zero is even.)",
      abilities: [
        {
          id: "qiv63tpshe-a1",
          kind: "triggered",
          text: "On Enter: Look at the top four cards of your deck and then put them back in any order.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 4,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "referenced-cards",
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "top",
                    orderChosenBy: "controller",
                  },
                },
              },
            ],
          },
        },
        {
          id: "qiv63tpshe-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] [REST], (2): Reveal the top card of your deck. If that card's reserve cost is even, put a buff counter on Idle Fatestone. Otherwise, transform Idle Fatestone. (Zero is even.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "pay-reserve",
                amount: 2,
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  filter: {
                    kind: "parity",
                    property: "reserve-cost",
                    value: "even",
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 1,
                },
                else: {
                  kind: "transform",
                  subject: {
                    kind: "source",
                  },
                },
              },
            ],
          },
        },
      ],
    },
    flipFace: {
      id: "qiv63tpshe:face:flip",
      catalogId: "ddfwa6m0e9",
      name: "Bolstered Boar",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "BOAR"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "As long as Bolstered Boar has two or more buff counters on it, it has steadfast, taunt, vigor, and retort 2.",
      abilities: [
        {
          id: "ddfwa6m0e9-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Bolstered Boar has two or more buff counters on it, it has steadfast, taunt, vigor, and retort 2.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: "buff",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "steadfast",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: "buff",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "taunt",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: "buff",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "vigor",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: "buff",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "retort",
                  value: 2,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default idleFatestone;
