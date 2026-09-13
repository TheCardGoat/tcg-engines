import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unruledBereavement: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cAcgxzrz6z",
  slug: "unruled-bereavement",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cAcgxzrz6z:face:default",
      catalogId: "cAcgxzrz6z",
      name: "Unruled Bereavement",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] As long as your champion has leveled up this turn, this card costs 2 less to activate.\n\nUntil end of turn, whenever an ally dies, empower 2.\n\n[Level 7+] Deal 3 damage to all allies.",
      abilities: [
        {
          id: "cAcgxzrz6z-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as your champion has leveled up this turn, this card costs 2 less to activate.",
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
              condition: {
                kind: "history",
                event: "champion-leveled-up",
                window: "this-turn",
                actor: "controller",
                minimum: 1,
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
          id: "cAcgxzrz6z-a2",
          kind: "card-resolution",
          text: "Until end of turn, whenever an ally dies, empower 2.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "object-died",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
            },
            effect: {
              kind: "keyword-action",
              action: "empower",
              amount: 2,
            },
            expires: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "cAcgxzrz6z-a3",
          kind: "card-resolution",
          text: "[Level 7+] Deal 3 damage to all allies.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 7,
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default unruledBereavement;
