import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const drownedCut: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2djBo4ecDL",
  slug: "drowned-cut",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2djBo4ecDL:face:default",
      catalogId: "2djBo4ecDL",
      name: "Drowned Cut",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "2djBo4ecDL-a1",
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

export default drownedCut;
