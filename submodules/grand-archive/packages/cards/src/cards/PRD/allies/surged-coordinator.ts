import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surgedCoordinator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6eWmfzAmWr",
  slug: "surged-coordinator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6eWmfzAmWr:face:default",
      catalogId: "6eWmfzAmWr",
      name: "Surged Coordinator",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "[Class Bonus] On Enter: Put LV+X-3 static counters on Surged Coordinator, where X is the amount of other objects you control with one or more static counters on them. (Whenever an arcane element unit deals combat damage to an object, you may remove a static counter from this unit and deal 1 damage to the object that was dealt damage.)",
      abilities: [
        {
          id: "6eWmfzAmWr-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put LV+X-3 static counters on Surged Coordinator, where X is the amount of other objects you control with one or more static counters on them. (Whenever an arcane element unit deals combat damage to an object, you may remove a static counter from this unit and deal 1 damage to the object that was dealt damage.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "not-source",
                      },
                      {
                        kind: "has-counter",
                        counter: "static",
                      },
                    ],
                  },
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "static",
            amount: {
              kind: "calculate",
              operator: "subtract",
              operands: [
                {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
                    {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "not-source",
                            },
                            {
                              kind: "has-counter",
                              counter: "static",
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
                3,
              ],
            },
          },
        },
      ],
    },
  },
};

export default surgedCoordinator;
