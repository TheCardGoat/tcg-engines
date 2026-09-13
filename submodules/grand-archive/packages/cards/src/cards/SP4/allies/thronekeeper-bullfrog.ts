import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const thronekeeperBullfrog: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jdog5yo5gg",
  slug: "thronekeeper-bullfrog",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jdog5yo5gg:face:default",
      catalogId: "jdog5yo5gg",
      name: "Throne-Keeper Bullfrog",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ANIMAL", "HUMAN", "FROG"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "jdog5yo5gg-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "jdog5yo5gg-a2",
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

export default thronekeeperBullfrog;
