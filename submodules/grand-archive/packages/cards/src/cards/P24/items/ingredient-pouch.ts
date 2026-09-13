import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ingredientPouch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u7d6soporh",
  slug: "ingredient-pouch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u7d6soporh:face:default",
      catalogId: "u7d6soporh",
      name: "Ingredient Pouch",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(1), REST: Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
      abilities: [
        {
          id: "u7d6soporh-a1",
          kind: "activated",
          text: "(1), REST: Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "keyword-action",
            action: "gather",
          },
        },
      ],
    },
  },
};

export default ingredientPouch;
