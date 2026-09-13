import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const savageSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4a7QLLouGk",
  slug: "savage-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4a7QLLouGk:face:default",
      catalogId: "4a7QLLouGk",
      name: "Savage Slash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "4a7QLLouGk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion's class matches this card's class.)",
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

export default savageSlash;
