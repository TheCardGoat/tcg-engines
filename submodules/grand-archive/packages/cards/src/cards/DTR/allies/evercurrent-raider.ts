import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const evercurrentRaider: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0r7j97g2zh",
  slug: "evercurrent-raider",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0r7j97g2zh:face:default",
      catalogId: "0r7j97g2zh",
      name: "Evercurrent Raider",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPECTER"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Floating Memory\n\nEphemerate — (2) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "0r7j97g2zh-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
        {
          id: "0r7j97g2zh-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default evercurrentRaider;
