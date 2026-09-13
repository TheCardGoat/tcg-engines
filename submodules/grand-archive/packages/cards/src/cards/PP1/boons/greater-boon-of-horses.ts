import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfHorses: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "asZfaFnTXs",
  slug: "greater-boon-of-horses",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "asZfaFnTXs:face:default",
      catalogId: "asZfaFnTXs",
      name: "Greater Boon of Horses",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["TAMER", "WARRIOR"],
        subtypes: ["TAMER", "WARRIOR", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked, Level Locked 2\n\nAs you gain this boon, put any amount of Horse ally cards with total reserve cost 10 or less from your memory onto the field. They each enter the field with an additional buff counter on them. Then draw a card into your memory for each ally put onto the field this way.",
      abilities: [
        {
          id: "asZfaFnTXs-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked, Level Locked 2",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "champion-matches-source",
                    characteristic: "class",
                  },
                  {
                    kind: "compare",
                    comparison: {
                      left: {
                        kind: "property",
                        subject: {
                          kind: "champion",
                          player: "controller",
                        },
                        property: "level",
                        basis: "base",
                      },
                      operator: "gte",
                      right: 2,
                    },
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "asZfaFnTXs-a2",
          kind: "triggered",
          text: "As you gain this boon, put any amount of Horse ally cards with total reserve cost 10 or less from your memory onto the field. They each enter the field with an additional buff counter on them. Then draw a card into your memory for each ally put onto the field this way.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "deployed-allies",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              aggregateConstraint: {
                property: "reserve-cost",
                operation: "sum",
                operator: "lte",
                value: 10,
                basis: "base",
              },
              candidates: {
                kind: "card",
                zones: ["memory"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HORSE"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "deployed-allies",
                  },
                  from: "memory",
                  destination: {
                    zone: "field",
                  },
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "deployed-allies",
                  },
                  counter: "buff",
                  amount: 1,
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: {
                    kind: "count",
                    collection: {
                      binding: "deployed-allies",
                    },
                  },
                  to: "memory",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default greaterBoonOfHorses;
