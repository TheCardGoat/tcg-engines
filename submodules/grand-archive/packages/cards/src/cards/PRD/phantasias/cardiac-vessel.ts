import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cardiacVessel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5xjzPh6l2M",
  slug: "cardiac-vessel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5xjzPh6l2M:face:default",
      catalogId: "5xjzPh6l2M",
      name: "Cardiac Vessel",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 3 less to activate.\n\nOn Enter: Move all damage counters from your champion onto Cardiac Vessel. If fifteen or more counters were moved this way, draw a card.\n\nOn Leave: Put the damage counters that were on Cardiac Vessel onto your champion.",
      abilities: [
        {
          id: "5xjzPh6l2M-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 3 less to activate.",
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
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "5xjzPh6l2M-a2",
          kind: "triggered",
          text: "On Enter: Move all damage counters from your champion onto Cardiac Vessel. If fifteen or more counters were moved this way, draw a card.",
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
                kind: "move-counter",
                from: {
                  kind: "champion",
                  player: "controller",
                },
                to: {
                  kind: "source",
                },
                counter: "damage",
                amount: {
                  kind: "all",
                },
                bindResultAs: "moved-damage-counters",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "modified-ability-result-amount",
                      metric: "counters-removed",
                    },
                    operator: "gte",
                    right: 15,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "5xjzPh6l2M-a3",
          kind: "triggered",
          text: "On Leave: Put the damage counters that were on Cardiac Vessel onto your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "move-counter",
            from: {
              kind: "event-subject",
            },
            to: {
              kind: "champion",
              player: "controller",
            },
            counter: "damage",
            amount: {
              kind: "all",
            },
          },
        },
      ],
    },
  },
};

export default cardiacVessel;
