import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const harbingerOfLightning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1i5z6r7s9k",
  slug: "harbinger-of-lightning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1i5z6r7s9k:face:default",
      catalogId: "1i5z6r7s9k",
      name: "Harbinger of Lightning",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE", "TAMER"],
        subtypes: ["MAGE", "TAMER", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "As long as you control an arcane element Shenju ally, ignore this card's elemental requirements as you activate it. \n\n[Class Bonus] On Death: Banish Harbinger of Lightning, and a card at random from your memory. When you do, as a Spell, deal X damage to target champion where X is the total reserve cost of the banished cards.",
      abilities: [
        {
          id: "1i5z6r7s9k-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control an arcane element Shenju ally, ignore this card's elemental requirements as you activate it.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "element",
                        oneOf: ["ARCANE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SHENJU"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "1i5z6r7s9k-a2",
          kind: "triggered",
          text: "[Class Bonus] On Death: Banish Harbinger of Lightning, and a card at random from your memory. When you do, as a Spell, deal X damage to target champion where X is the total reserve cost of the banished cards.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-champion",
              kind: "target",
              declared: "announcement",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  {
                    kind: "property",
                    subject: {
                      kind: "source",
                    },
                    property: "reserve-cost",
                    basis: "last-known",
                    missing: "zero",
                  },
                  {
                    kind: "aggregate-property",
                    operation: "sum",
                    collection: {
                      binding: "random-banished-card",
                    },
                    property: "reserve-cost",
                    basis: "base",
                    emptyValue: 0,
                  },
                ],
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
            kind: "reflexive",
            action: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "random-banished-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                    method: "random",
                  },
                  bindResultAs: "random-banished-card",
                },
              ],
            },
            consequence: {
              kind: "perform-as",
              sourceKind: "spell",
              effect: {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-champion",
                },
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    {
                      kind: "property",
                      subject: {
                        kind: "source",
                      },
                      property: "reserve-cost",
                      basis: "last-known",
                      missing: "zero",
                    },
                    {
                      kind: "aggregate-property",
                      operation: "sum",
                      collection: {
                        binding: "random-banished-card",
                      },
                      property: "reserve-cost",
                      basis: "base",
                      emptyValue: 0,
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default harbingerOfLightning;
