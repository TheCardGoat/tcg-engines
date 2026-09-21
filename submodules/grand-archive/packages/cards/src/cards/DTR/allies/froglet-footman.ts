import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frogletFootman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fbvt9rdhkj",
  slug: "froglet-footman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fbvt9rdhkj:face:default",
      catalogId: "fbvt9rdhkj",
      name: "Froglet Footman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ANIMAL", "HUMAN", "FROG"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "If damage would be dealt to Froglet Footman while it has a buff counter on it, prevent 1 of that damage.\n\nOn Enter: You may banish a card with floating memory from your graveyard. If you do, put a buff counter on Froglet Footman.\n\n",
      abilities: [
        {
          id: "fbvt9rdhkj-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to Froglet Footman while it has a buff counter on it, prevent 1 of that damage.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
              },
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
                  right: 1,
                },
              },
              operation: {
                kind: "prevent",
                amount: 1,
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "fbvt9rdhkj-a2",
          kind: "triggered",
          text: "On Enter: You may banish a card with floating memory from your graveyard. If you do, put a buff counter on Froglet Footman.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "has-keyword",
                          keyword: "floating-memory",
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "add-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: "buff",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default frogletFootman;
