import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const apostleOfTheWoods: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sg2ghTKuDt",
  slug: "apostle-of-the-woods",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sg2ghTKuDt:face:default",
      catalogId: "sg2ghTKuDt",
      name: "Apostle of the Woods",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "TIGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "Pride 3\n\n[Class Bonus] On Enter: Apostle of the Woods loses pride until end of turn. Then if an opponent controls three or more units, put a buff counter on Apostle of the Woods.",
      abilities: [
        {
          id: "sg2ghTKuDt-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "sg2ghTKuDt-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Apostle of the Woods loses pride until end of turn. Then if an opponent controls three or more units, put a buff counter on Apostle of the Woods.",
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
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "each-opponent",
                        filter: {
                          kind: "type",
                          oneOf: ["ALLY", "CHAMPION"],
                        },
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
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

export default apostleOfTheWoods;
