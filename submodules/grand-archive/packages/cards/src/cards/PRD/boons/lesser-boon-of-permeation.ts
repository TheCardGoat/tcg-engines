import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfPermeation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "woez6MYh46",
  slug: "lesser-boon-of-permeation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "woez6MYh46:face:default",
      catalogId: "woez6MYh46",
      name: "Lesser Boon of Permeation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Whenever one or more durability counters are removed from a domain named Pantheon Barrier you control, put the top X cards of your deck into your graveyard, where X is the amount of durability counters removed this way.",
      abilities: [
        {
          id: "woez6MYh46-a1",
          kind: "triggered",
          text: "Whenever one or more durability counters are removed from a domain named Pantheon Barrier you control, put the top X cards of your deck into your graveyard, where X is the amount of durability counters removed this way.",
          trigger: {
            kind: "event",
            cardinality: "one-or-more",
            event: {
              name: "counter-removed",
              counter: "durability",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["DOMAIN"],
                    },
                    {
                      kind: "name",
                      value: "Pantheon Barrier",
                    },
                  ],
                },
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "event-amount",
              },
            },
          ],
          effect: {
            kind: "mill",
            player: "controller",
            amount: {
              kind: "event-amount",
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfPermeation;
