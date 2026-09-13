import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seasideRingleader: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eirpdm44nt",
  slug: "seaside-ringleader",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eirpdm44nt:face:default",
      catalogId: "eirpdm44nt",
      name: "Seaside Ringleader",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] [Element Bonus] (2), Banish this card from your graveyard: Draw a card into your memory. Until end of turn, Animal and Beast ally cards you activate this turn enter the field with an additional buff counter on them.",
      abilities: [
        {
          id: "eirpdm44nt-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Element Bonus] (2), Banish this card from your graveyard: Draw a card into your memory. Until end of turn, Animal and Beast ally cards you activate this turn enter the field with an additional buff counter on them.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
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
                    ],
                  },
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

export default seasideRingleader;
