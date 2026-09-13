import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const anotherRound: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "94KW6YRrtC",
  slug: "another-round",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "94KW6YRrtC:face:default",
      catalogId: "94KW6YRrtC",
      name: "Another Round",
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
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Recover 1+X, where X is twice the amount of cards named Another Round in all graveyards. Then draw a card into your memory.\n",
      abilities: [
        {
          id: "94KW6YRrtC-a1",
          kind: "card-resolution",
          text: "Recover 1+X, where X is twice the amount of cards named Another Round in all graveyards. Then draw a card into your memory.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["graveyard"],
                      player: "each-player",
                      filter: {
                        kind: "name",
                        value: "Another Round",
                      },
                    },
                  },
                  2,
                ],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    1,
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                  ],
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default anotherRound;
