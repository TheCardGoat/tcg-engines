import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const evaporationSynchron: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rAiEX6Ra4p",
  slug: "evaporation-synchron",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rAiEX6Ra4p:face:default",
      catalogId: "rAiEX6Ra4p",
      name: "Evaporation Synchron",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BAUBLE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Whenever a water element card with floating memory is banished from an opponent's graveyard, put a refinement counter on Evaporation Synchron.\n\nWhile paying for a memory cost, you may remove any amount of refinement counters from Evaporation Synchron. Each counter removed this way pays for 1 of that cost.",
      abilities: [
        {
          id: "rAiEX6Ra4p-a1",
          kind: "triggered",
          text: "Whenever a water element card with floating memory is banished from an opponent's graveyard, put a refinement counter on Evaporation Synchron.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              from: "graveyard",
              subject: {
                kind: "event-object",
                owner: "opponent",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                    {
                      kind: "has-keyword",
                      keyword: "floating-memory",
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            amount: 1,
          },
        },
        {
          id: "rAiEX6Ra4p-a2",
          kind: "static",
          staticKind: "effects",
          text: "While paying for a memory cost, you may remove any amount of refinement counters from Evaporation Synchron. Each counter removed this way pays for 1 of that cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "player",
                player: "controller",
              },
              costKind: "memory",
              cost: {
                kind: "select-and-remove-counters",
                player: "controller",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
                count: {
                  kind: "any-number",
                },
              },
              amount: 1,
              contributionBasis: "per-paid-object",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default evaporationSynchron;
