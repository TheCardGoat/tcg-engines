import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const oasisTradingPost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uy4xippor7",
  slug: "oasis-trading-post",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uy4xippor7:face:default",
      catalogId: "uy4xippor7",
      name: "Oasis Trading Post",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "MARKET"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(3), REST: Glimpse 2.\n\n(4), REST: Gather.\n\n(5), REST: Summon an Automaton Drone token.",
      abilities: [
        {
          id: "uy4xippor7-a1",
          kind: "activated",
          text: "(3), REST: Glimpse 2.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
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
            amount: 2,
          },
        },
        {
          id: "uy4xippor7-a2",
          kind: "activated",
          text: "(4), REST: Gather.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
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
            action: "gather",
          },
        },
        {
          id: "uy4xippor7-a3",
          kind: "activated",
          text: "(5), REST: Summon an Automaton Drone token.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 5,
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
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default oasisTradingPost;
