import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const queensCinderhog: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9fZMLbyRWd",
  slug: "queens-cinderhog",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9fZMLbyRWd:face:default",
      catalogId: "9fZMLbyRWd",
      name: "Queen's Cinderhog",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ANIMAL", "BOAR"],
      },
      elements: ["EXALTED", "FIRE"],
      stats: {
        power: 4,
        life: 2,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\n[Class Bonus]Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "9fZMLbyRWd-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "9fZMLbyRWd-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus]Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default queensCinderhog;
