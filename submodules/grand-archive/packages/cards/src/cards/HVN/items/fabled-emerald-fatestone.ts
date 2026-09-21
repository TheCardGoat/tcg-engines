import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fabledEmeraldFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jz7odeqku4",
  slug: "fabled-emerald-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "jz7odeqku4:face:default",
      catalogId: "jz7odeqku4",
      name: "Fabled Emerald Fatestone",
      cost: {
        kind: "memory",
        amount: 8,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Immortality, Spellshroud\n\n[Guo Jia Bonus] (4), REST: As a Spell, suppress another target item, weapon, or ally. Activate this ability only once.\n\n[Guo Jia Bonus] Whenever you suppress an object, put a quest counter on your champion.\n\nREST: You may remove eight quest counters from your champion. If you do, wake up and transform Fabled Emerald Fatestone.",
      abilities: [
        {
          id: "jz7odeqku4-a1",
          kind: "keyword-group",
          text: "Immortality, Spellshroud",
          keywords: [
            {
              name: "immortality",
            },
            {
              name: "spellshroud",
            },
          ],
        },
        {
          id: "jz7odeqku4-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (4), REST: As a Spell, suppress another target item, weapon, or ally. Activate this ability only once.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          limit: {
            count: 1,
            per: "source-instance",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "keyword-action",
              action: "suppress",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
            },
          },
        },
        {
          id: "jz7odeqku4-a3",
          kind: "triggered",
          text: "[Guo Jia Bonus] Whenever you suppress an object, put a quest counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "suppress",
              subject: {
                kind: "event-object",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: {
              named: "quest",
            },
            amount: 1,
          },
        },
        {
          id: "jz7odeqku4-a4",
          kind: "activated",
          text: "REST: You may remove eight quest counters from your champion. If you do, wake up and transform Fabled Emerald Fatestone.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "remove-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: {
                      named: "quest",
                    },
                    amount: 8,
                    bindResultAs: "removed-counters",
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "wake",
                        subject: {
                          kind: "source",
                        },
                      },
                      {
                        kind: "transform",
                        subject: {
                          kind: "source",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      ],
    },
    flipFace: {
      id: "jz7odeqku4:face:flip",
      catalogId: "r1sc1xaf9l",
      name: "Byakko, White Tiger",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SHENJU", "FATEBOUND", "TIGER"],
      },
      elements: ["WIND"],
      stats: {
        power: 6,
        life: 6,
      },
      rulesText:
        "Spellshroud, Vigor\n\n[Guo Jia Bonus] The first Animal or Beast ally card you activate each turn costs 2 less to activate.\n\n[Guo Jia Bonus] Beast allies you control lose pride.",
      abilities: [
        {
          id: "r1sc1xaf9l-a1",
          kind: "keyword-group",
          text: "Spellshroud, Vigor",
          keywords: [
            {
              name: "spellshroud",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "r1sc1xaf9l-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Guo Jia Bonus] The first Animal or Beast ally card you activate each turn costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "any",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["ANIMAL"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BEAST"],
                      },
                    ],
                  },
                ],
              },
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
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
          id: "r1sc1xaf9l-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Guo Jia Bonus] Beast allies you control lose pride.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        kind: "subtype",
                        oneOf: ["BEAST"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-keyword",
                keyword: {
                  name: "pride",
                  anyValue: true,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default fabledEmeraldFatestone;
