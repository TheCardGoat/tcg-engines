import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const resonantechModule: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qalnrTTPal",
  slug: "resonantech-module",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qalnrTTPal:face:default",
      catalogId: "qalnrTTPal",
      name: "ResonanTech Module",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "RESONATOR", "VELTECH", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "As long as you control two or more Resonator allies, this card costs 1 less to materialize.\n\nREST: Glimpse 1. The next Harmony or Melody card you activate this turn costs 1 less to activate.",
      abilities: [
        {
          id: "qalnrTTPal-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control two or more Resonator allies, this card costs 1 less to materialize.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
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
                            oneOf: ["RESONATOR"],
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qalnrTTPal-a2",
          kind: "activated",
          text: "REST: Glimpse 1. The next Harmony or Melody card you activate this turn costs 1 less to activate.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 1,
              },
              {
                kind: "rule-modification",
                mode: "modify-cost",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
                costKind: "reserve",
                costOperation: "subtract",
                amount: 1,
                duration: {
                  kind: "for-next-event",
                  event: "card-activated",
                  expires: {
                    kind: "this-turn",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default resonantechModule;
