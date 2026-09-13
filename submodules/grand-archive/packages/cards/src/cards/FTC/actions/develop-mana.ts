import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const developMana: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wzh973fdt8",
  slug: "develop-mana",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wzh973fdt8:face:default",
      catalogId: "wzh973fdt8",
      name: "Develop Mana",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a level counter on your champion. (Champions get +1 level for each level counter on them.)",
      abilities: [
        {
          id: "wzh973fdt8-a1",
          kind: "card-resolution",
          text: "Put a level counter on your champion. (Champions get +1 level for each level counter on them.)",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "level",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default developMana;
