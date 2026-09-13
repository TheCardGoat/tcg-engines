import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimesBlessing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ioxgugw9r9",
  slug: "slimes-blessing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ioxgugw9r9:face:default",
      catalogId: "ioxgugw9r9",
      name: "Slime's Blessing",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SLIME", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nChoose up to three units. Put a level counter on each chosen champion and a buff counter on each chosen Slime ally. (Champions get +1 level for each level counter on them.)",
      abilities: [
        {
          id: "ioxgugw9r9-a1",
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
          id: "ioxgugw9r9-a2",
          kind: "card-resolution",
          text: "Choose up to three units. Put a level counter on each chosen champion and a buff counter on each chosen Slime ally. (Champions get +1 level for each level counter on them.)",
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-units",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
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
              kind: "for-each",
              collection: {
                binding: "chosen-units",
              },
              bindEachAs: "chosen-unit",
              effect: {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "chosen-unit",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "chosen-unit",
                  },
                  counter: "level",
                  amount: 1,
                },
                else: {
                  kind: "conditional",
                  condition: {
                    kind: "subject-matches",
                    subject: {
                      kind: "bound",
                      binding: "chosen-unit",
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
                          oneOf: ["SLIME"],
                        },
                      ],
                    },
                  },
                  then: {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "chosen-unit",
                    },
                    counter: "buff",
                    amount: 1,
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default slimesBlessing;
