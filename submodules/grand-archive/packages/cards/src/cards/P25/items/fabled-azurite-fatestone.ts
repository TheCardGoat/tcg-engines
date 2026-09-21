import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fabledAzuriteFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6ce5rzrjd9",
  slug: "fabled-azurite-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "6ce5rzrjd9:face:default",
      catalogId: "6ce5rzrjd9",
      name: "Fabled Azurite Fatestone",
      cost: {
        kind: "memory",
        amount: 10,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "Immortality, Spellshroud\n\n[Guo Jia Bonus] At the beginning of your end phase, you may banish a card at random from your memory. If you do, draw a card.\n\n[Guo Jia Bonus] Whenever you banish a card from your memory, put a quest counter on your champion. \n\nREST: You may remove ten quest counters from your champion. If you do, wake up and transform Fabled Azurite Fatestone.",
      abilities: [
        {
          id: "6ce5rzrjd9-a1",
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
          id: "6ce5rzrjd9-a2",
          kind: "triggered",
          text: "[Guo Jia Bonus] At the beginning of your end phase, you may banish a card at random from your memory. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
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
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
        {
          id: "6ce5rzrjd9-a3",
          kind: "triggered",
          text: "[Guo Jia Bonus] Whenever you banish a card from your memory, put a quest counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              actor: "controller",
              from: "memory",
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
          id: "6ce5rzrjd9-a4",
          kind: "activated",
          text: "REST: You may remove ten quest counters from your champion. If you do, wake up and transform Fabled Azurite Fatestone.",
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
                    amount: 10,
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
      id: "6ce5rzrjd9:face:flip",
      catalogId: "fcfxhkqda6",
      name: "Seiryuu, Azure Dragon",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SHENJU", "FATEBOUND", "DRAGON"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 4,
        life: 12,
      },
      rulesText:
        "Spellshroud, Taunt\n\n[Guo Jia Bonus] On Attack: Choose one— \n • Generate an Arcane Blast card and banish it. As long as it's banished, you may activate it, ignoring its elemental requirements.\n • Empower X+2, where X is the amount of arcane element cards in your banishment.",
      abilities: [
        {
          id: "fcfxhkqda6-a1",
          kind: "keyword-group",
          text: "Spellshroud, Taunt",
          keywords: [
            {
              name: "spellshroud",
            },
            {
              name: "taunt",
            },
          ],
        },
        {
          id: "fcfxhkqda6-a2",
          kind: "triggered",
          text: "[Guo Jia Bonus] On Attack: Choose one—\n• Generate an Arcane Blast card and banish it. As long as it's banished, you may activate it, ignoring its elemental requirements.\n• Empower X+2, where X is the amount of arcane element cards in your banishment.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
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
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "generate-arcane-blast",
                text: "Generate an Arcane Blast card and banish it. As long as it's banished, you may activate it, ignoring its elemental requirements.",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "generate",
                      card: "Arcane Blast",
                      player: "controller",
                      destination: {
                        zone: "banishment",
                      },
                      bindResultAs: "generated-arcane-blast",
                    },
                    {
                      kind: "rule-modification",
                      mode: "allow",
                      action: "activate",
                      subject: {
                        kind: "bound",
                        binding: "generated-arcane-blast",
                      },
                      fromZone: "banishment",
                      duration: {
                        kind: "while-subjects-in-zone",
                        subjects: {
                          kind: "bound",
                          binding: "generated-arcane-blast",
                        },
                        zone: "banishment",
                        scope: "per-object",
                      },
                    },
                    {
                      kind: "rule-modification",
                      mode: "allow",
                      action: "ignore-element-requirement",
                      subject: {
                        kind: "bound",
                        binding: "generated-arcane-blast",
                      },
                      fromZone: "banishment",
                      duration: {
                        kind: "while-subjects-in-zone",
                        subjects: {
                          kind: "bound",
                          binding: "generated-arcane-blast",
                        },
                        zone: "banishment",
                        scope: "per-object",
                      },
                    },
                  ],
                },
              },
              {
                id: "empower",
                text: "Empower X+2, where X is the amount of arcane element cards in your banishment.",
                variables: [
                  {
                    symbol: "X",
                    kind: "derived",
                    amount: {
                      kind: "count",
                      collection: {
                        zones: ["banishment"],
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["ARCANE"],
                        },
                      },
                    },
                  },
                ],
                effect: {
                  kind: "keyword-action",
                  action: "empower",
                  player: "controller",
                  amount: {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      {
                        kind: "count",
                        collection: {
                          zones: ["banishment"],
                          player: "controller",
                          filter: {
                            kind: "element",
                            oneOf: ["ARCANE"],
                          },
                        },
                      },
                      2,
                    ],
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

export default fabledAzuriteFatestone;
