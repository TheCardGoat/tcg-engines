import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const humptyDumptyFatesFall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aou4be9z82",
  slug: "humpty-dumpty-fates-fall",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aou4be9z82:face:default",
      catalogId: "aou4be9z82",
      name: "Humpty Dumpty, Fate's Fall",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "REST: Put a buff counter on Humpty Dumpty. Then glimpse X, where X is the amount of buff counters on Humpty Dumpty.\n\n(2): Until end of turn, Humpty Dumpty becomes an ally in addition to its other types with base power and life 0.",
      abilities: [
        {
          id: "aou4be9z82-a1",
          kind: "activated",
          text: "REST: Put a buff counter on Humpty Dumpty. Then glimpse X, where X is the amount of buff counters on Humpty Dumpty.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: "buff",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                amount: 1,
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            ],
          },
        },
        {
          id: "aou4be9z82-a2",
          kind: "activated",
          text: "(2): Until end of turn, Humpty Dumpty becomes an ally in addition to its other types with base power and life 0.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "type",
                    value: "ALLY",
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "A",
                  modifies: "base-stats",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "set",
                  amount: 0,
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "A",
                  modifies: "base-stats",
                },
                change: {
                  kind: "numeric",
                  property: "life",
                  operation: "set",
                  amount: 0,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default humptyDumptyFatesFall;
