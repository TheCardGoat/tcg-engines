import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const savageAttack: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3ewnten2rn",
  slug: "savage-attack",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3ewnten2rn:face:default",
      catalogId: "3ewnten2rn",
      name: "Savage Attack",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "3ewnten2rn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default savageAttack;
