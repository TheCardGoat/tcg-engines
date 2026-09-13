import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const temporalSpectrometer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h23qu7d6so",
  slug: "temporal-spectrometer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h23qu7d6so:face:default",
      catalogId: "h23qu7d6so",
      name: "Temporal Spectrometer",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic\n\nREST: Put a time counter on Temporal Spectrometer.\n\nWhile paying for a memory cost, you may sacrifice Temporal Spectrometer to pay for X of that cost, where X is the amount of time counters on Temporal Spectrometer.",
      abilities: [
        {
          id: "h23qu7d6so-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "h23qu7d6so-a2",
          kind: "activated",
          text: "REST: Put a time counter on Temporal Spectrometer.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "time",
            },
            amount: 1,
          },
        },
        {
          id: "h23qu7d6so-a3",
          kind: "static",
          staticKind: "effects",
          text: "While paying for a memory cost, you may sacrifice Temporal Spectrometer to pay for X of that cost, where X is the amount of time counters on Temporal Spectrometer.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "time",
                },
              },
            },
          ],
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
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "time",
                },
              },
              contributionBasis: "total",
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

export default temporalSpectrometer;
