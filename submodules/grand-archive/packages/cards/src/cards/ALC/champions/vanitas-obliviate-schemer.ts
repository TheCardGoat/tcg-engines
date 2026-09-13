import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vanitasObliviateSchemer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x8bd7ozuj6",
  slug: "vanitas-obliviate-schemer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x8bd7ozuj6:face:default",
      catalogId: "x8bd7ozuj6",
      name: "Vanitas, Obliviate Schemer",
      lineageName: "Vanitas",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "Vanitas can only level up into another \"Vanitas\" champion.\n\nOn Enter: If there's another wind element card in Vanitas' lineage, glimpse 4.",
      abilities: [
        {
          id: "x8bd7ozuj6-a1",
          kind: "static",
          staticKind: "effects",
          text: 'Vanitas can only level up into another "Vanitas" champion.',
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "level-up",
              subject: {
                kind: "source",
              },
              destinationFilter: {
                kind: "champion-name",
                value: "Vanitas",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "x8bd7ozuj6-a2",
          kind: "triggered",
          text: "On Enter: If there's another wind element card in Vanitas' lineage, glimpse 4.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["inner-lineage"],
                host: {
                  kind: "champion",
                  player: "controller",
                },
                relationship: "lineage-of",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
            then: {
              kind: "keyword-action",
              action: "glimpse",
              amount: 4,
            },
          },
        },
      ],
    },
  },
};

export default vanitasObliviateSchemer;
