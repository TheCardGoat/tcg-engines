import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shieldroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qCTini03Bc",
  slug: "shieldroid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qCTini03Bc:face:default",
      catalogId: "qCTini03Bc",
      name: "Shieldroid",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DISCORP", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other objects you control during your opponents’ attack declarations if able.)\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "qCTini03Bc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other objects you control during your opponents’ attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "qCTini03Bc-a2",
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

export default shieldroid;
