import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const glacierRemnants: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vftUL7ZjFM",
  slug: "glacier-remnants",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vftUL7ZjFM:face:default",
      catalogId: "vftUL7ZjFM",
      name: "Glacier Remnants",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SIEGEABLE", "RUINS"],
      },
      elements: ["WATER"],
      stats: {
        durability: 6,
      },
      rulesText:
        "At the beginning of your recollection phase, remove up to two durability counters from Glacier Remnants. Then recover X, where X is the amount of counters removed this way.\n\nFloating Memory",
      abilities: [
        {
          id: "vftUL7ZjFM-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, remove up to two durability counters from Glacier Remnants. Then recover X, where X is the amount of counters removed this way.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "counters-removed",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: "durability",
                amount: 2,
                bindResultAs: "removed-counters",
              },
              {
                kind: "recover",
                player: "controller",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            ],
          },
        },
        {
          id: "vftUL7ZjFM-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default glacierRemnants;
