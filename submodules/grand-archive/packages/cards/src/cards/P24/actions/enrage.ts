import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enrage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wcfvrfw35s",
  slug: "enrage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wcfvrfw35s:face:default",
      catalogId: "wcfvrfw35s",
      name: "Enrage",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Damage 20+] This card costs 2 less to activate. (Apply this effect only if there are twenty or more damage counters on your champion.)\n\nDeal 4 unpreventable damage to your champion. Then, their next attack this turn gets +1 POWER for every four damage counters on them.",
      abilities: [
        {
          id: "wcfvrfw35s-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Damage 20+] This card costs 2 less to activate. (Apply this effect only if there are twenty or more damage counters on your champion.)",
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 20,
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
          id: "wcfvrfw35s-a2",
          kind: "card-resolution",
          text: "Deal 4 unpreventable damage to your champion. Then, their next attack this turn gets +1 POWER for every four damage counters on them.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: 4,
                preventable: false,
              },
              {
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
                  },
                },
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
                      kind: "calculate",
                      operator: "divide",
                      operands: [
                        {
                          kind: "counter-count",
                          subject: {
                            kind: "champion",
                            player: "controller",
                          },
                          counter: "damage",
                        },
                        4,
                      ],
                      rounding: "down",
                    },
                  },
                },
                limit: 1,
                expires: {
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

export default enrage;
