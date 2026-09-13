import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stalwartShieldmate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eifnz0fgm3",
  slug: "stalwart-shieldmate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eifnz0fgm3:face:default",
      catalogId: "eifnz0fgm3",
      name: "Stalwart Shieldmate",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "eifnz0fgm3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "eifnz0fgm3-a2",
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

export default stalwartShieldmate;
