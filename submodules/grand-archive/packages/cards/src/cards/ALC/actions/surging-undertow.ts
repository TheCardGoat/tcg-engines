import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surgingUndertow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "44eld1c5ac",
  slug: "surging-undertow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "44eld1c5ac:face:default",
      catalogId: "44eld1c5ac",
      name: "Surging Undertow",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nPut the top three cards of your deck into your graveyard. Then if there are three or more water element cards in your graveyard, choose a unit and it becomes distant.",
      abilities: [
        {
          id: "44eld1c5ac-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "44eld1c5ac-a2",
          kind: "card-resolution",
          text: "Put the top three cards of your deck into your graveyard. Then if there are three or more water element cards in your graveyard, choose a unit and it becomes distant.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "mill",
                player: "controller",
                amount: 3,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["graveyard"],
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["WATER"],
                        },
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "choose",
                  selection: {
                    id: "target-1",
                    kind: "choice",
                    declared: "resolution",
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
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  effect: {
                    kind: "set-object-state",
                    subject: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    state: "distant",
                    value: true,
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

export default surgingUndertow;
