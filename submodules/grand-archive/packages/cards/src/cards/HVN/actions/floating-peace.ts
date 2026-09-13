import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const floatingPeace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0s4xe169m2",
  slug: "floating-peace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0s4xe169m2:face:default",
      catalogId: "0s4xe169m2",
      name: "Floating Peace",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Recover 1+X, where X is the amount of Fatestone and Fatebound objects you control.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "0s4xe169m2-a1",
          kind: "card-resolution",
          text: "Recover 1+X, where X is the amount of Fatestone and Fatebound objects you control.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "any",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["FATESTONE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["FATEBOUND"],
                      },
                    ],
                  },
                },
              },
            },
          ],
          effect: {
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
        },
        {
          id: "0s4xe169m2-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default floatingPeace;
