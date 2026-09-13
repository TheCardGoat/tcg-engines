import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const commandTheHunt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rxxwQT054x",
  slug: "command-the-hunt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rxxwQT054x:face:default",
      catalogId: "rxxwQT054x",
      name: "Command the Hunt",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "This card costs 2 less to activate if no units have attacked this turn.\n\nAllies you control get +2 POWER and gain vigor until end of turn. Those allies must attack champions this turn if able. (Units with vigor wake up at the beginning of your end phase.)",
      abilities: [
        {
          id: "rxxwQT054x-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate if no units have attacked this turn.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "not",
                condition: {
                  kind: "history",
                  event: "attack-declared",
                  window: "this-turn",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                  minimum: 1,
                },
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
          id: "rxxwQT054x-a2",
          kind: "card-resolution",
          text: "Allies you control get +2 POWER and gain vigor until end of turn. Those allies must attack champions this turn if able. (Units with vigor wake up at the beginning of your end phase.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
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
                  amount: 2,
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
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
                kind: "rule-modification",
                mode: "require",
                action: "attack",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                against: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "each-opponent",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
                requiredCount: {
                  minimum: 1,
                  per: "turn",
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default commandTheHunt;
