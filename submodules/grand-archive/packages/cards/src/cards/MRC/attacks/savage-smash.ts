import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const savageSmash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i7chsbaleg",
  slug: "savage-smash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i7chsbaleg:face:default",
      catalogId: "i7chsbaleg",
      name: "Savage Smash",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "i7chsbaleg-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion’s class matches this card’s class.)",
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

export default savageSmash;
