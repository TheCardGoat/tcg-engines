import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const theConstellatorySpire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yd609g44vm",
  slug: "the-constellatory-spire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yd609g44vm:face:default",
      catalogId: "yd609g44vm",
      name: "The Constellatory Spire",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPIRE"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nOn Enter: Draw a card.\n\nWhenever you negate a card activation, you may rest The Constellatory Spire. When you do, deal 2 damage to target unit.",
      abilities: [
        {
          id: "yd609g44vm-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "yd609g44vm-a2",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "yd609g44vm-a3",
          kind: "triggered",
          text: "Whenever you negate a card activation, you may rest The Constellatory Spire. When you do, deal 2 damage to target unit.",
          trigger: {
            kind: "event",
            event: {
              name: "stack-item-negated",
              actor: "controller",
              itemTypes: ["card-activation"],
              subject: {
                kind: "event-object",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              consequence: {
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
              targets: [
                {
                  id: "target-1",
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
                      oneOf: ["ALLY", "CHAMPION"],
                    },
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

export default theConstellatorySpire;
