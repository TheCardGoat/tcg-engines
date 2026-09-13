import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aquatechShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "C89p0c3Sqb",
  slug: "aquatech-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "C89p0c3Sqb:face:default",
      catalogId: "C89p0c3Sqb",
      name: "AquaTech Shield",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "SHIELD"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Ally Link\n\nLink Shield \n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "C89p0c3Sqb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "C89p0c3Sqb-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Link Shield",
          keyword: {
            name: "link-shield",
          },
        },
        {
          id: "C89p0c3Sqb-a3",
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

export default aquatechShield;
