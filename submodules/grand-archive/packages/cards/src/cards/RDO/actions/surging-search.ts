import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surgingSearch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h0vBIZjzrI",
  slug: "surging-search",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h0vBIZjzrI:face:default",
      catalogId: "h0vBIZjzrI",
      name: "Surging Search",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Scavenge 6 for an arcane element card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "h0vBIZjzrI-a1",
          kind: "card-resolution",
          text: "Scavenge 6 for an arcane element card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 6,
            filter: {
              kind: "element",
              oneOf: ["ARCANE"],
            },
          },
        },
        {
          id: "h0vBIZjzrI-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
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

export default surgingSearch;
