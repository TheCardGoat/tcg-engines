import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const indissolubleFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ULHGVVpQoH",
  slug: "indissoluble-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ULHGVVpQoH:face:default",
      catalogId: "ULHGVVpQoH",
      name: "Indissoluble Fractal",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPECTER", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)\n\n[Class Bonus] Ephemerate — (5) (You may activate this card from your graveyard by paying this cost. Phantasia cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "ULHGVVpQoH-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "ULHGVVpQoH-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ephemerate — (5) (You may activate this card from your graveyard by paying this cost. Phantasia cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 5,
            },
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

export default indissolubleFractal;
