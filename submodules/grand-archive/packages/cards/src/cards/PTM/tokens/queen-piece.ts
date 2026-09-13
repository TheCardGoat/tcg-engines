import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const queenPiece: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "m69XrVkaVh",
  slug: "queen-piece",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "m69XrVkaVh:face:default",
      catalogId: "m69XrVkaVh",
      name: "Queen Piece",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "QUEEN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Alice Bonus] As long as you control one or more Chessman Pawn allies, prevent all damage that would be dealt to Queen Piece.\n\n[Alice Bonus] Commanded Will 6 (As long as this unit is attacking using a Command card, it gets +6POWER.)\n",
      abilities: [
        {
          id: "m69XrVkaVh-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] As long as you control one or more Chessman Pawn allies, prevent all damage that would be dealt to Queen Piece.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["PAWN"],
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "prevent",
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "m69XrVkaVh-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Commanded Will 6 (As long as this unit is attacking using a Command card, it gets +6POWER.)",
          keyword: {
            name: "commanded-will",
            value: 6,
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
        },
      ],
    },
  },
};

export default queenPiece;
