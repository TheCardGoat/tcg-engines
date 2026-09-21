import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const carterSyntheticReaper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1wl8ao8bls",
  slug: "carter-synthetic-reaper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1wl8ao8bls:face:default",
      catalogId: "1wl8ao8bls",
      name: "Carter, Synthetic Reaper",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN", "RANGER"],
        subtypes: ["GUARDIAN", "RANGER", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Cleave\n\nWhenever an ally dies, recover 1.\n\nOn Enter: You may sacrifice another ally. If you do, Carter gets +2 POWER until end of turn. If an Automaton ally was sacrificed this way, draw a card.",
      abilities: [
        {
          id: "1wl8ao8bls-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Cleave",
          keyword: {
            name: "cleave",
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
        },
        {
          id: "1wl8ao8bls-a2",
          kind: "triggered",
          text: "Whenever an ally dies, recover 1.",
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
            kind: "recover",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "1wl8ao8bls-a3",
          kind: "triggered",
          text: "On Enter: You may sacrifice another ally. If you do, Carter gets +2 POWER until end of turn. If an Automaton ally was sacrificed this way, draw a card.",
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
                      id: "sacrificed-object",
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
                              kind: "not-source",
                            },
                          ],
                        },
                      },
                    },
                    effect: {
                      kind: "sacrifice",
                      subject: {
                        kind: "bound",
                        binding: "sacrificed-object",
                      },
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
                    kind: "sequence",
                    effects: [
                      {
                        kind: "continuous",
                        subjects: {
                          kind: "source",
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
                        kind: "conditional",
                        condition: {
                          kind: "subject-matches",
                          subject: {
                            kind: "bound",
                            binding: "sacrificed-object",
                          },
                          filter: {
                            kind: "all",
                            filters: [
                              {
                                kind: "type",
                                oneOf: ["ALLY"],
                              },
                              {
                                kind: "subtype",
                                oneOf: ["AUTOMATON"],
                              },
                            ],
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
              ],
            },
          },
        },
      ],
    },
  },
};

export default carterSyntheticReaper;
