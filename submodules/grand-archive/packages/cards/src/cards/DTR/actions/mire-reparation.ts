import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mireReparation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7imoz7vrlr",
  slug: "mire-reparation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7imoz7vrlr:face:default",
      catalogId: "7imoz7vrlr",
      name: "Mire Reparation",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Recover X, where X is the amount of omens you have.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "7imoz7vrlr-a1",
          kind: "card-resolution",
          text: "Recover X, where X is the amount of omens you have.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "player-property",
                player: "controller",
                property: "omens",
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
        {
          id: "7imoz7vrlr-a2",
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

export default mireReparation;
