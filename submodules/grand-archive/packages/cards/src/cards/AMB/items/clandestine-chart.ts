import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clandestineChart: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "js5qjwipkf",
  slug: "clandestine-chart",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "js5qjwipkf:face:default",
      catalogId: "js5qjwipkf",
      name: "Clandestine Chart",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "MAP"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(2), Banish Clandestine Chart: Glimpse 2. Put a preparation counter on your champion.",
      abilities: [
        {
          id: "js5qjwipkf-a1",
          kind: "activated",
          text: "(2), Banish Clandestine Chart: Glimpse 2. Put a preparation counter on your champion.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 2,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default clandestineChart;
