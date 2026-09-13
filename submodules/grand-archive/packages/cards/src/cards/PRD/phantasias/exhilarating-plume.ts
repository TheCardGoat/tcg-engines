import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const exhilaratingPlume: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "A9c8tb7LKD",
  slug: "exhilarating-plume",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "A9c8tb7LKD:face:default",
      catalogId: "A9c8tb7LKD",
      name: "Exhilarating Plume",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["EXALTED", "WIND"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nHuman ally cards you activate enter the field with an additional buff counter on them.",
      abilities: [
        {
          id: "A9c8tb7LKD-a1",
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
          id: "A9c8tb7LKD-a2",
          kind: "static",
          staticKind: "effects",
          text: "Human ally cards you activate enter the field with an additional buff counter on them.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
                cause: {
                  kind: "card-activation",
                  controller: "controller",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: "buff",
                    amount: 1,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default exhilaratingPlume;
