import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const animalEncounter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TULjDAgAQB",
  slug: "animal-encounter",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "TULjDAgAQB:face:default",
      catalogId: "TULjDAgAQB",
      name: "Animal Encounter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nPut a buff counter on an ally you control and up to one ally you don't control. If a buff counter was put on an ally you don't control this way, you gain the Crowd's Favor status. ",
      abilities: [
        {
          id: "TULjDAgAQB-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "TULjDAgAQB-a2",
          kind: "card-resolution",
          text: "Put a buff counter on an ally you control and up to one ally you don't control. If a buff counter was put on an ally you don't control this way, you gain the Crowd's Favor status.",
          effect: {
            kind: "choose",
            selection: {
              id: "your-ally",
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
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            effect: {
              kind: "choose",
              selection: {
                id: "opposing-ally",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "up-to",
                  amount: 1,
                },
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "each-opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
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
                      binding: "your-ally",
                    },
                    counter: "buff",
                    amount: 1,
                  },
                  {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "opposing-ally",
                    },
                    counter: "buff",
                    amount: 1,
                  },
                  {
                    kind: "conditional",
                    condition: {
                      kind: "compare",
                      comparison: {
                        left: {
                          kind: "count",
                          collection: {
                            binding: "opposing-ally",
                          },
                        },
                        operator: "gte",
                        right: 1,
                      },
                    },
                    then: {
                      kind: "set-player-state",
                      player: "controller",
                      state: {
                        named: "crowds-favor",
                      },
                      value: true,
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default animalEncounter;
