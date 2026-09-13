import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flameRuneSwordsman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "VV6ADdMrr5",
  slug: "flame-rune-swordsman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "VV6ADdMrr5:face:default",
      catalogId: "VV6ADdMrr5",
      name: "Flame-Rune Swordsman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE", "WARRIOR"],
        subtypes: ["MAGE", "WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "VV6ADdMrr5-a1",
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

export default flameRuneSwordsman;
