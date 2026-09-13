import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silverSoldier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c3C6PjX0Vt",
  slug: "silver-soldier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c3C6PjX0Vt:face:default",
      catalogId: "c3C6PjX0Vt",
      name: "Silver Soldier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nRetort 2, Vigor",
      abilities: [
        {
          id: "c3C6PjX0Vt-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "c3C6PjX0Vt-a2",
          kind: "keyword-group",
          text: "Retort 2, Vigor",
          keywords: [
            {
              name: "retort",
              value: 2,
            },
            {
              name: "vigor",
            },
          ],
        },
      ],
    },
  },
};

export default silverSoldier;
