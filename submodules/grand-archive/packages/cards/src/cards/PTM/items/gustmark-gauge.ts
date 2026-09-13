import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gustmarkGauge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cMixAGt8zv",
  slug: "gustmark-gauge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cMixAGt8zv:face:default",
      catalogId: "cMixAGt8zv",
      name: "Gustmark Gauge",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "DEVICE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "As long as Gustmark Gauge is awake, Chessman allies you control get +1 LIFE.\n\n[Level 2+] As long as Gustmark Gauge is rested, Chessman allies you control get +1 POWER.\n\n(2), REST: Glimpse 1.",
      abilities: [
        {
          id: "cMixAGt8zv-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Gustmark Gauge is awake, Chessman allies you control get +1 LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        oneOf: ["CHESSMAN"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "awake",
              },
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
                amount: 1,
              },
            },
          ],
        },
        {
          id: "cMixAGt8zv-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] As long as Gustmark Gauge is rested, Chessman allies you control get +1 POWER.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        oneOf: ["CHESSMAN"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "rested",
              },
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
                amount: 1,
              },
            },
          ],
        },
        {
          id: "cMixAGt8zv-a3",
          kind: "activated",
          text: "(2), REST: Glimpse 1.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default gustmarkGauge;
