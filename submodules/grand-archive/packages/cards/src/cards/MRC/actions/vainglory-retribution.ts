import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vaingloryRetribution: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qtzsekkjn3",
  slug: "vainglory-retribution",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qtzsekkjn3:face:default",
      catalogId: "qtzsekkjn3",
      name: "Vainglory Retribution",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Vanitas Bonus] [Level 2+] This card costs 2 less to activate.\n\nThe next time your champion would take 4 or less combat damage this turn, prevent it. Your champion’s first attack without a weapon during your next turn gets +X POWER, where X is the amount of damage prevented this way.",
      abilities: [
        {
          id: "qtzsekkjn3-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Vanitas Bonus] [Level 2+] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Vanitas",
              },
            },
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
                  right: 2,
                },
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
          id: "qtzsekkjn3-a2",
          kind: "card-resolution",
          text: "The next time your champion would take 4 or less combat damage this turn, prevent it. Your champion’s first attack without a weapon during your next turn gets +X POWER, where X is the amount of damage prevented this way.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "binding",
                binding: "prevented-damage",
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
              combatDamage: true,
              amountComparison: {
                left: {
                  kind: "event-amount",
                },
                operator: "lte",
                right: 4,
              },
            },
            limit: {
              count: 1,
              per: "object",
            },
            operation: {
              kind: "prevent",
            },
            afterApply: {
              kind: "bind-value",
              value: {
                kind: "modified-ability-result-amount",
                metric: "damage-prevented",
              },
              bindAs: "prevented-damage",
              effect: {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-declared",
                    subject: {
                      kind: "event-object",
                      controller: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                    usingAbsent: {
                      kind: "any",
                    },
                  },
                },
                starts: {
                  kind: "next-turn",
                  whose: "controller",
                },
                expires: {
                  kind: "until-end-of-next-turn",
                  whose: "controller",
                },
                limit: 1,
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: {
                      kind: "binding",
                      binding: "prevented-damage",
                    },
                  },
                },
              },
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default vaingloryRetribution;
