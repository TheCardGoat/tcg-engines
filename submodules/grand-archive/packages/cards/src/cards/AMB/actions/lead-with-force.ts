import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const leadWithForce: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yhu0djqlp8",
  slug: "lead-with-force",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yhu0djqlp8:face:default",
      catalogId: "yhu0djqlp8",
      name: "Lead with Force",
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
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion’s class matches this card’s class.)\n\nTarget ally gets +1 LIFE until end of turn. If that ally is an Animal or a Beast, put a buff counter on it. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "yhu0djqlp8-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion’s class matches this card’s class.)",
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
          id: "yhu0djqlp8-a2",
          kind: "card-resolution",
          text: "Target ally gets +1 LIFE until end of turn. If that ally is an Animal or a Beast, put a buff counter on it. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
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
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
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
                  property: "life",
                  operation: "add",
                  amount: 1,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "any",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["ANIMAL"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BEAST"],
                      },
                    ],
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
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

export default leadWithForce;
