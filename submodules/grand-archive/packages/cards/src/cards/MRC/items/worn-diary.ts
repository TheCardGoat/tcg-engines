import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wornDiary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gmuesdu6o6",
  slug: "worn-diary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gmuesdu6o6:face:default",
      catalogId: "gmuesdu6o6",
      name: "Worn Diary",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BOOK"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST: Put a page counter on Worn Diary for each card in your memory.\n\nREST, Banish Worn Diary: Draw a card. Activate this ability only if there are ten or more page counters on Worn Diary.",
      abilities: [
        {
          id: "gmuesdu6o6-a1",
          kind: "activated",
          text: "REST: Put a page counter on Worn Diary for each card in your memory.",
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
              named: "page",
            },
            amount: {
              kind: "count",
              collection: {
                zones: ["memory"],
                player: "controller",
              },
            },
          },
        },
        {
          id: "gmuesdu6o6-a2",
          kind: "activated",
          text: "REST, Banish Worn Diary: Draw a card. Activate this ability only if there are ten or more page counters on Worn Diary.",
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
                kind: "banish-self",
              },
            ],
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "page",
                },
              },
              operator: "gte",
              right: 10,
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

export default wornDiary;
