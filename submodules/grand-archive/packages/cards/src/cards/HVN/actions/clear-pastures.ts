import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clearPastures: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y0jzczoywm",
  slug: "clear-pastures",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y0jzczoywm:face:default",
      catalogId: "y0jzczoywm",
      name: "Clear Pastures",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Equestrian — If you control a Horse ally, glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)\n\nDraw a card into your memory. ",
      abilities: [
        {
          id: "y0jzczoywm-a1",
          kind: "card-resolution",
          text: "Equestrian — If you control a Horse ally, glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HORSE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "keyword-action",
              action: "glimpse",
              amount: 3,
            },
          },
          label: {
            name: "Equestrian",
          },
        },
        {
          id: "y0jzczoywm-a2",
          kind: "card-resolution",
          text: "Draw a card into your memory.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default clearPastures;
