import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const corsairCaptain: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4e1gqwah01",
  slug: "corsair-captain",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4e1gqwah01:face:default",
      catalogId: "4e1gqwah01",
      name: "Corsair Captain",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "4e1gqwah01-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "4e1gqwah01-a2",
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

export default corsairCaptain;
