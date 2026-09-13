import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heightenSpellcraft: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zejeq7rp5q",
  slug: "heighten-spellcraft",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zejeq7rp5q:face:default",
      catalogId: "zejeq7rp5q",
      name: "Heighten Spellcraft",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Empower 3. (The next Spell card you activate this turn activates and resolves as if your champion got +3 level.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "zejeq7rp5q-a1",
          kind: "card-resolution",
          text: "Empower 3. (The next Spell card you activate this turn activates and resolves as if your champion got +3 level.)",
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 3,
          },
        },
        {
          id: "zejeq7rp5q-a2",
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

export default heightenSpellcraft;
