import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lorraineHonedOperative: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UsX7t4lXfX",
  slug: "lorraine-honed-operative",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UsX7t4lXfX:face:default",
      catalogId: "UsX7t4lXfX",
      name: "Lorraine, Honed Operative",
      lineageName: "Lorraine",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 24,
      },
      rulesText:
        "Lorraine Lineage\n\nOn Enter: Banish up to three cards at random from your memory. For each card banished this way, draw a card into your memory. If that card is advanced element, put a durability counter on a Sword weapon you control and it gets +1POWER until end of turn.",
      abilities: [
        {
          id: "UsX7t4lXfX-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Lorraine Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Lorraine",
          },
        },
        {
          id: "UsX7t4lXfX-a2",
          kind: "triggered",
          text: "On Enter: Banish up to three cards at random from your memory. For each card banished this way, draw a card into your memory. If that card is advanced element, put a durability counter on a Sword weapon you control and it gets +1POWER until end of turn.",
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
                kind: "choose-value",
                trackAs: "memory-refresh-count",
                selection: {
                  id: "memory-refresh-count",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "number",
                    minimum: 0,
                    maximum: {
                      kind: "calculate",
                      operator: "minimum",
                      operands: [
                        3,
                        {
                          kind: "count",
                          collection: {
                            zones: ["memory"],
                            player: "controller",
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "refreshed-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: {
                      kind: "binding",
                      binding: "memory-refresh-count",
                    },
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
              {
                kind: "for-each",
                collection: {
                  binding: "refreshed-memory-cards",
                },
                bindEachAs: "refreshed-memory-card",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                      to: "memory",
                      bindResultAs: "refreshed-drawn-card",
                    },
                    {
                      kind: "conditional",
                      condition: {
                        kind: "subject-matches",
                        subject: {
                          kind: "bound",
                          binding: "refreshed-drawn-card",
                        },
                        filter: {
                          kind: "element-category",
                          value: "advanced",
                        },
                      },
                      then: {
                        kind: "choose",
                        selection: {
                          id: "chosen-counter-object",
                          kind: "choice",
                          declared: "resolution",
                          chooser: "controller",
                          count: {
                            kind: "exactly",
                            amount: 1,
                          },
                          candidates: {
                            kind: "object",
                            zones: ["field"],
                            relationship: "controlled-by",
                            player: "controller",
                            filter: {
                              kind: "all",
                              filters: [
                                {
                                  kind: "type",
                                  oneOf: ["WEAPON"],
                                },
                                {
                                  kind: "subtype",
                                  oneOf: ["SWORD"],
                                },
                              ],
                            },
                          },
                        },
                        effect: {
                          kind: "sequence",
                          effects: [
                            {
                              kind: "add-counter",
                              subject: {
                                kind: "bound",
                                binding: "chosen-counter-object",
                              },
                              counter: "durability",
                              amount: 1,
                            },
                            {
                              kind: "continuous",
                              subjects: {
                                kind: "bound",
                                binding: "chosen-counter-object",
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
                                amount: 1,
                              },
                            },
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
      ],
    },
  },
};

export default lorraineHonedOperative;
