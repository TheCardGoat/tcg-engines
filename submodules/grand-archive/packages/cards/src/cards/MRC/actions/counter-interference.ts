import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const counterInterference: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CK4ZG5x6OF",
  slug: "counter-interference",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CK4ZG5x6OF:face:default",
      catalogId: "CK4ZG5x6OF",
      name: "Counter Interference",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Negate target trigger or action card activation that targets an Automaton ally you control. Then you may sacrifice a Powercell. If you do, draw a card.",
      abilities: [
        {
          id: "CK4ZG5x6OF-a1",
          kind: "card-resolution",
          text: "Negate target trigger or action card activation that targets an Automaton ally you control. Then you may sacrifice a Powercell. If you do, draw a card.",
          targets: [
            {
              id: "target-activation",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                anyOf: [
                  {
                    itemTypes: ["ability"],
                    abilityKinds: ["triggered"],
                  },
                  {
                    itemTypes: ["card-activation"],
                    sourceFilter: {
                      kind: "type",
                      oneOf: ["ACTION"],
                    },
                  },
                ],
                targeting: {
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
                        oneOf: ["AUTOMATON"],
                      },
                    ],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "negate",
                subject: {
                  kind: "bound",
                  binding: "target-activation",
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "powercell",
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
                        kind: "subtype",
                        oneOf: ["POWERCELL"],
                      },
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "sacrifice",
                        subject: {
                          kind: "bound",
                          binding: "powercell",
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
              },
            ],
          },
        },
      ],
    },
  },
};

export default counterInterference;
