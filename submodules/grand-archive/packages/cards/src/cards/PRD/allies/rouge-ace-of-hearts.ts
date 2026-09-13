import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rougeAceOfHearts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h68dr63eo5",
  slug: "rouge-ace-of-hearts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h68dr63eo5:face:default",
      catalogId: "h68dr63eo5",
      name: "Rouge, Ace of Hearts",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "On Enter: Depending on the total reserve cost of Suited objects you control—\n• 6— Choose a unit and deal 2 damage to it.\n• 10— Choose a unit and deal 4 damage to it.\n• 21— Choose a unit and deal 8 damage to it.",
      abilities: [
        {
          id: "h68dr63eo5-a1",
          kind: "triggered",
          text: "On Enter: Depending on the total reserve cost of Suited objects you control—\n• 6— Choose a unit and deal 2 damage to it.\n• 10— Choose a unit and deal 4 damage to it.\n• 21— Choose a unit and deal 8 damage to it.",
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
            kind: "branch-on-value",
            value: {
              kind: "aggregate-property",
              operation: "sum",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SUITED"],
                },
              },
              property: "reserve-cost",
              basis: "current",
              emptyValue: 0,
            },
            branches: [
              {
                minimum: 6,
                maximum: 6,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "target-1",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    amount: 2,
                  },
                },
              },
              {
                minimum: 10,
                maximum: 10,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "target-1",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    amount: 4,
                  },
                },
              },
              {
                minimum: 21,
                maximum: 21,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "target-1",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    amount: 8,
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

export default rougeAceOfHearts;
