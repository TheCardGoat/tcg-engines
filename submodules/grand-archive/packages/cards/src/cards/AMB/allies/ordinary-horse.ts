import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ordinaryHorse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w6ax750524",
  slug: "ordinary-horse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w6ax750524:face:default",
      catalogId: "w6ax750524",
      name: "Ordinary Horse",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "w6ax750524-a1",
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

export default ordinaryHorse;
