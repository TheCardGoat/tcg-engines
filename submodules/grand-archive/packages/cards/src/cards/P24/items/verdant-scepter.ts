import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const verdantScepter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7wsxirq146",
  slug: "verdant-scepter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7wsxirq146:face:default",
      catalogId: "7wsxirq146",
      name: "Verdant Scepter",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER", "MAGE"],
        subtypes: ["TAMER", "MAGE", "SCEPTER"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter: You may banish a Slime ally you control. If you do, put an amount of refinement counters on Verdant Scepter equal to the banished ally's power plus 1.\n\nREST, Remove a refinement counter from Verdant Scepter: Put a buff counter on each of up to two Slime allies you control then draw a card.",
      abilities: [
        {
          id: "7wsxirq146-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish a Slime ally you control. If you do, put an amount of refinement counters on Verdant Scepter equal to the banished ally's power plus 1.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "banished-object-choice",
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
                              oneOf: ["ALLY"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["SLIME"],
                            },
                          ],
                        },
                      },
                    },
                    effect: {
                      kind: "banish-object",
                      subject: {
                        kind: "bound",
                        binding: "banished-object-choice",
                      },
                      bindResultAs: "banished-object",
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
                    kind: "add-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "refinement",
                    },
                    amount: {
                      kind: "calculate",
                      operator: "add",
                      operands: [
                        {
                          kind: "property",
                          subject: {
                            kind: "tracked",
                            key: "banished-object",
                          },
                          property: "power",
                          basis: "last-known",
                          missing: "zero",
                        },
                        1,
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "7wsxirq146-a2",
          kind: "activated",
          text: "REST, Remove a refinement counter from Verdant Scepter: Put a buff counter on each of up to two Slime allies you control then draw a card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
                amount: 1,
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "counter-recipients",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
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
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SLIME"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "counter-recipients",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default verdantScepter;
