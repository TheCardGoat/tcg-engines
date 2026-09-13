import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cracklingIncineration: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "14bepZKPlK",
  slug: "crackling-incineration",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "14bepZKPlK:face:default",
      catalogId: "14bepZKPlK",
      name: "Crackling Incineration",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Sheen 6+] This card costs 2 less to activate.\n\nDestroy target item or weapon with memory cost 0 or reserve cost 4 or less. Then its controller puts a sheen counter on a unit they control.",
      abilities: [
        {
          id: "14bepZKPlK-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Sheen 6+] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 6,
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
          id: "14bepZKPlK-a2",
          kind: "card-resolution",
          text: "Destroy target item or weapon with memory cost 0 or reserve cost 4 or less. Then its controller puts a sheen counter on a unit they control.",
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
                      oneOf: ["ITEM", "WEAPON"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "memory-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 0,
                          },
                        },
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "reserve-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 4,
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "destroy",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                bindResultAs: "destroyed-object",
              },
              {
                kind: "choose",
                selection: {
                  id: "destroyed-controller-object",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    controllerOf: "destroyed-object",
                  },
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "object",
                    zones: ["field"],
                    relationship: "controlled-by",
                    player: {
                      controllerOf: "destroyed-object",
                    },
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "destroyed-controller-object",
                  },
                  counter: {
                    named: "sheen",
                  },
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default cracklingIncineration;
