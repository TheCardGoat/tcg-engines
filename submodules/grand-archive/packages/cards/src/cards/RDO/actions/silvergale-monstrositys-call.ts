import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silvergaleMonstrositysCall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lsLd8ADGAe",
  slug: "silvergale-monstrositys-call",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lsLd8ADGAe:face:default",
      catalogId: "lsLd8ADGAe",
      name: "Silvergale Monstrosity's Call",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Prepare 2\n\nSummon a Memorite Obelith token. If Silvergale Monstrosity's Call was prepared, move any amount of sheen counters from your Fractured Memories onto any amount of allies named Memorite Obelith you control.",
      abilities: [
        {
          id: "lsLd8ADGAe-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 2",
          keyword: {
            name: "prepare",
            value: 2,
          },
        },
        {
          id: "lsLd8ADGAe-a2",
          kind: "card-resolution",
          text: "Summon a Memorite Obelith token. If Silvergale Monstrosity's Call was prepared, move any amount of sheen counters from your Fractured Memories onto any amount of allies named Memorite Obelith you control.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                controller: "controller",
                object: "Memorite Obelith",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "prepared",
                },
                then: {
                  kind: "choose-value",
                  selection: {
                    id: "sheen-count",
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
                        kind: "counter-count",
                        subject: {
                          kind: "mastery",
                          player: "controller",
                          name: "Fractured Memories",
                        },
                        counter: {
                          named: "sheen",
                        },
                      },
                    },
                  },
                  trackAs: "sheen-count",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "prepared",
                },
                then: {
                  kind: "choose",
                  selection: {
                    id: "memorite-obelith-allies",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "any-number",
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
                            kind: "name",
                            value: "Memorite Obelith",
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "remove-counter",
                        subject: {
                          kind: "mastery",
                          player: "controller",
                          name: "Fractured Memories",
                        },
                        counter: {
                          named: "sheen",
                        },
                        amount: {
                          kind: "binding",
                          binding: "sheen-count",
                        },
                      },
                      {
                        kind: "distribute",
                        amount: {
                          kind: "binding",
                          binding: "sheen-count",
                        },
                        among: {
                          id: "memorite-obelith-allies",
                          kind: "choice",
                          declared: "resolution",
                          chooser: "controller",
                          count: {
                            kind: "any-number",
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
                                  kind: "name",
                                  value: "Memorite Obelith",
                                },
                              ],
                            },
                          },
                        },
                        payload: {
                          kind: "counter",
                          counter: {
                            named: "sheen",
                          },
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
};

export default silvergaleMonstrositysCall;
