import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dewdropHares: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fxwy3haEXU",
  slug: "dewdrop-hares",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fxwy3haEXU:face:default",
      catalogId: "fxwy3haEXU",
      name: "Dewdrop Hares",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "RABBIT"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "fxwy3haEXU-a1",
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

export default dewdropHares;
