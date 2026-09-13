import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shatterfallKeep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n1voy5ttkk",
  slug: "shatterfall-keep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n1voy5ttkk:face:default",
      catalogId: "n1voy5ttkk",
      name: "Shatterfall Keep",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CATACLYSM"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "REST, Banish a card with floating memory from your graveyard: Put the top two cards of your deck into your graveyard.\n\nUpkeep — At the beginning of your recollection phase, if there are less than three water element cards in your graveyard, sacrifice Shatterfall Keep.",
      abilities: [
        {
          id: "n1voy5ttkk-a1",
          kind: "activated",
          text: "REST, Banish a card with floating memory from your graveyard: Put the top two cards of your deck into your graveyard.",
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
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "has-keyword",
                  keyword: "floating-memory",
                },
              },
            ],
          },
          effect: {
            kind: "mill",
            player: "controller",
            amount: 2,
          },
        },
        {
          id: "n1voy5ttkk-a2",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, if there are less than three water element cards in your graveyard, sacrifice Shatterfall Keep.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["graveyard"],
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                  },
                },
                operator: "lt",
                right: 3,
              },
            },
            then: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          },
          label: {
            name: "Upkeep",
          },
        },
      ],
    },
  },
};

export default shatterfallKeep;
