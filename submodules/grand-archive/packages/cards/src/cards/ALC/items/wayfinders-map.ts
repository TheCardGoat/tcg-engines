import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wayfindersMap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "porhlq2kkv",
  slug: "wayfinders-map",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "porhlq2kkv:face:default",
      catalogId: "porhlq2kkv",
      name: "Wayfinder's Map",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "MAP"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Domain cards you activate cost 1 less to activate.\n\nBanish Wayfinder's Map: Draw a card. Activate this ability only if you control three or more domains.",
      abilities: [
        {
          id: "porhlq2kkv-a1",
          kind: "static",
          staticKind: "effects",
          text: "Domain cards you activate cost 1 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              filter: {
                kind: "type",
                oneOf: ["DOMAIN"],
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "porhlq2kkv-a2",
          kind: "activated",
          text: "Banish Wayfinder's Map: Draw a card. Activate this ability only if you control three or more domains.",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
                    kind: "type",
                    oneOf: ["DOMAIN"],
                  },
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default wayfindersMap;
