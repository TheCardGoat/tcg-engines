import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deepSeaBeastbonder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qxbdXU7H4Z",
  slug: "deep-sea-beastbonder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qxbdXU7H4Z:face:default",
      catalogId: "qxbdXU7H4Z",
      name: "Deep Sea Beastbonder",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Your champion gets +1 level as long as you control an Animal or Beast ally. \n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "qxbdXU7H4Z-a1",
          kind: "static",
          staticKind: "effects",
          text: "Your champion gets +1 level as long as you control an Animal or Beast ally.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
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
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "level",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "qxbdXU7H4Z-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default deepSeaBeastbonder;
