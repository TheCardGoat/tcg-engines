import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const neosElemental: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jwsl7dedg6",
  slug: "neos-elemental",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jwsl7dedg6:face:default",
      catalogId: "jwsl7dedg6",
      name: "Neos Elemental",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ELEMENTAL"],
      },
      elements: ["NEOS"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate for each token object you control.\n\nHindered (This ally enters the field rested.)\n\nSteadfast, Taunt, True Sight, Vigor\n\nNeos Elemental gets +1 POWER and +1 LIFE for each token object you control.",
      abilities: [
        {
          id: "jwsl7dedg6-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate for each token object you control.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "token",
                    value: true,
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "jwsl7dedg6-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This ally enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "jwsl7dedg6-a3",
          kind: "keyword-group",
          text: "Steadfast, Taunt, True Sight, Vigor",
          keywords: [
            {
              name: "steadfast",
            },
            {
              name: "taunt",
            },
            {
              name: "true-sight",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "jwsl7dedg6-a4",
          kind: "static",
          staticKind: "effects",
          text: "Neos Elemental gets +1 POWER and +1 LIFE for each token object you control.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
                    },
                  },
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default neosElemental;
