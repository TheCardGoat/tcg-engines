import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reboundingGust: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9e0z7hb9id",
  slug: "rebounding-gust",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9e0z7hb9id:face:default",
      catalogId: "9e0z7hb9id",
      name: "Rebounding Gust",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 2 less to activate as long as it's targeting an attacking ally.\nReturn target ally to its owner's memory. ",
      abilities: [
        {
          id: "9e0z7hb9id-a1",
          kind: "card-resolution",
          text: "This card costs 2 less to activate as long as it's targeting an attacking ally.\nReturn target ally to its owner's memory.",
          activationRules: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "ability-target-matches",
                ability: "this",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
                quantifier: "any",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
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
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default reboundingGust;
