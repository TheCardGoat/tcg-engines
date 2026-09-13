import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dissipation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Q9b0d7fkGv",
  slug: "dissipation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Q9b0d7fkGv:face:default",
      catalogId: "Q9b0d7fkGv",
      name: "Dissipation",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nDestroy all phantasias.",
      abilities: [
        {
          id: "Q9b0d7fkGv-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "Q9b0d7fkGv-a2",
          kind: "card-resolution",
          text: "Destroy all phantasias.",
          effect: {
            kind: "destroy",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["PHANTASIA"],
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default dissipation;
