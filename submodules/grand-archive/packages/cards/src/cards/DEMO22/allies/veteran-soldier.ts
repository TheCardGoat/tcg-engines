import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veteranSoldier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vefcX6tBeg",
  slug: "veteran-soldier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vefcX6tBeg:face:default",
      catalogId: "vefcX6tBeg",
      name: "Veteran Soldier",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "vefcX6tBeg-a1",
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

export default veteranSoldier;
