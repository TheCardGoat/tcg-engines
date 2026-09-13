import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jovialTinkerer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bKSlyTrW41",
  slug: "jovial-tinkerer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bKSlyTrW41:face:default",
      catalogId: "bKSlyTrW41",
      name: "Jovial Tinkerer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: If you control a VelTech item, draw a card into your memory. ",
      abilities: [
        {
          id: "bKSlyTrW41-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If you control a VelTech item, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["VELTECH"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default jovialTinkerer;
