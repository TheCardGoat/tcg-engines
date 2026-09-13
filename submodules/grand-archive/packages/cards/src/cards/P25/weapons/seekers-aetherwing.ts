import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seekersAetherwing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bf7yzaqes4",
  slug: "seekers-aetherwing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bf7yzaqes4:face:default",
      catalogId: "bf7yzaqes4",
      name: "Seeker's Aetherwing",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERWING"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "(Aetherwing — Must be loaded to use for an attack and can’t be used with an attack card.)\n\n[Class Bonus] Spellshroud (This object can't be targeted by Spells.)\n\n[Class Bonus] True Sight (Attacks using this weapon can target units with stealth.)",
      abilities: [
        {
          id: "bf7yzaqes4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Aetherwing — Must be loaded to use for an attack and can’t be used with an attack card.)",
          keyword: {
            name: "aetherwing",
          },
        },
        {
          id: "bf7yzaqes4-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Spellshroud (This object can't be targeted by Spells.)",
          keyword: {
            name: "spellshroud",
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
        {
          id: "bf7yzaqes4-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] True Sight (Attacks using this weapon can target units with stealth.)",
          keyword: {
            name: "true-sight",
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

export default seekersAetherwing;
