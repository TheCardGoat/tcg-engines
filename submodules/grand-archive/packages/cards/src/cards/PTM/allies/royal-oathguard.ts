import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const royalOathguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g3DQoQvyjI",
  slug: "royal-oathguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g3DQoQvyjI:face:default",
      catalogId: "g3DQoQvyjI",
      name: "Royal Oathguard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nIntercept, Vigor",
      abilities: [
        {
          id: "g3DQoQvyjI-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "g3DQoQvyjI-a2",
          kind: "keyword-group",
          text: "Intercept, Vigor",
          keywords: [
            {
              name: "intercept",
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

export default royalOathguard;
