import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pendantOfAccrual: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WUhbG91eRa",
  slug: "pendant-of-accrual",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WUhbG91eRa:face:default",
      catalogId: "WUhbG91eRa",
      name: "Pendant of Accrual",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of each opponent's recollection phase, they may pay (2). If they don't, put a debt counter on Pendant of Accrual.\n\nREST, Remove two debt counters from Pendant of Accrual: Draw a card into your memory.",
      abilities: [
        {
          id: "WUhbG91eRa-a1",
          kind: "triggered",
          text: "At the beginning of each opponent's recollection phase, they may pay (2). If they don't, put a debt counter on Pendant of Accrual.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "opponent",
            },
          },
          effect: {
            kind: "optional",
            player: "event-actor",
            allOrNothing: true,
            effect: {
              kind: "pay",
              player: "event-actor",
              cost: {
                kind: "pay-reserve",
                amount: 2,
              },
            },
            otherwise: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "debt",
              },
              amount: 1,
            },
          },
        },
        {
          id: "WUhbG91eRa-a2",
          kind: "activated",
          text: "REST, Remove two debt counters from Pendant of Accrual: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "debt",
                },
                amount: 2,
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default pendantOfAccrual;
