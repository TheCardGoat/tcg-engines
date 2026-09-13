import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const safeguardPaladin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ifmmvbm26h",
  slug: "safeguard-paladin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ifmmvbm26h:face:default",
      catalogId: "ifmmvbm26h",
      name: "Safeguard Paladin",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] If non-combat damage would be dealt to Safeguard Paladin, prevent 2 of that damage. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "ifmmvbm26h-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If non-combat damage would be dealt to Safeguard Paladin, prevent 2 of that damage. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
                combatDamage: false,
              },
              operation: {
                kind: "prevent",
                amount: 2,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default safeguardPaladin;
