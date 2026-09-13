import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ordinaryBear: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p3nq0ymvdd",
  slug: "ordinary-bear",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p3nq0ymvdd:face:default",
      catalogId: "p3nq0ymvdd",
      name: "Ordinary Bear",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "BEAR"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Pride 2 (This ally won't obey you unless your champion is level 2 or higher.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "p3nq0ymvdd-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 2 (This ally won't obey you unless your champion is level 2 or higher.)",
          keyword: {
            name: "pride",
            value: 2,
          },
        },
        {
          id: "p3nq0ymvdd-a2",
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

export default ordinaryBear;
