import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slashAndBurn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o0nkly21ee",
  slug: "slash-and-burn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o0nkly21ee:face:default",
      catalogId: "o0nkly21ee",
      name: "Slash and Burn",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nGather. Then you may banish up to three fire element cards from your graveyard. For each card banished this way, gather.",
      abilities: [
        {
          id: "o0nkly21ee-a1",
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
          id: "o0nkly21ee-a2",
          kind: "card-resolution",
          text: "Gather. Then you may banish up to three fire element cards from your graveyard. For each card banished this way, gather.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "gather",
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "banish",
                      player: "controller",
                      selection: {
                        id: "banished-cards",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "up-to",
                          amount: 3,
                        },
                        candidates: {
                          kind: "card",
                          zones: ["graveyard"],
                          relationship: "zone-of",
                          player: "controller",
                          filter: {
                            kind: "element",
                            oneOf: ["FIRE"],
                          },
                        },
                      },
                    },
                    {
                      kind: "for-each",
                      collection: {
                        binding: "banished-cards",
                      },
                      bindEachAs: "that-card",
                      effect: {
                        kind: "keyword-action",
                        action: "gather",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default slashAndBurn;
