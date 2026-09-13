import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hydrocaskDroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GdCFiPyKyM",
  slug: "hydrocask-droid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GdCFiPyKyM:face:default",
      catalogId: "GdCFiPyKyM",
      name: "Hydrocask Droid",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: If you have one or more cards with floating memory in your graveyard, Hydrocask Droid gets +2POWER until end of turn.",
      abilities: [
        {
          id: "GdCFiPyKyM-a1",
          kind: "triggered",
          text: "On Enter: If you have one or more cards with floating memory in your graveyard, Hydrocask Droid gets +2POWER until end of turn.",
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
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["graveyard"],
                    player: "controller",
                    filter: {
                      kind: "has-keyword",
                      keyword: "floating-memory",
                    },
                  },
                },
                operator: "gte",
                right: 1,
              },
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-turn",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
          },
        },
      ],
    },
  },
};

export default hydrocaskDroid;
