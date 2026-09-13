import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const condemnedTrinket: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "21oy1nd4nw",
  slug: "condemned-trinket",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "21oy1nd4nw:face:default",
      catalogId: "21oy1nd4nw",
      name: "Condemned Trinket",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(3), Banish Condemned Trinket: Banish a card from your graveyard and put an omen counter on it.",
      abilities: [
        {
          id: "21oy1nd4nw-a1",
          kind: "activated",
          text: "(3), Banish Condemned Trinket: Banish a card from your graveyard and put an omen counter on it.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default condemnedTrinket;
