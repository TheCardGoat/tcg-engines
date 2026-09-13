import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lavastorm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7K9pWqEc20",
  slug: "lavastorm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7K9pWqEc20:face:default",
      catalogId: "7K9pWqEc20",
      name: "Lavastorm",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["EXALTED", "FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nDestroy all allies.",
      abilities: [
        {
          id: "7K9pWqEc20-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "7K9pWqEc20-a2",
          kind: "card-resolution",
          text: "Destroy all allies.",
          effect: {
            kind: "destroy",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default lavastorm;
