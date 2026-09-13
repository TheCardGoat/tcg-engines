import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloamspireBlackMarket: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "waf8urrqtj",
  slug: "gloamspire-black-market",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "waf8urrqtj:face:default",
      catalogId: "waf8urrqtj",
      name: "Gloamspire, Black Market",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "MARKET"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "REST: Each player with influence less than seven draws a card into their memory. Activate this ability only at slow speed.\n\nUpkeep — At the beginning of your recollection phase, if your influence is eight or greater, sacrifice Gloamspire.",
      abilities: [
        {
          id: "waf8urrqtj-a1",
          kind: "activated",
          text: "REST: Each player with influence less than seven draws a card into their memory. Activate this ability only at slow speed.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "for-each-player",
            players: "each-player",
            bindEachAs: "eligible-player",
            effect: {
              kind: "conditional",
              condition: {
                kind: "player-property-compare",
                players: {
                  binding: "eligible-player",
                },
                quantifier: "all",
                property: "influence",
                operator: "lt",
                value: 7,
              },
              then: {
                kind: "draw",
                player: {
                  binding: "eligible-player",
                },
                amount: 1,
                to: "memory",
              },
            },
          },
        },
        {
          id: "waf8urrqtj-a2",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, if your influence is eight or greater, sacrifice Gloamspire.",
          label: {
            name: "Upkeep",
          },
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          interveningCondition: {
            kind: "player-property-compare",
            players: "controller",
            quantifier: "all",
            property: "influence",
            operator: "gte",
            value: 8,
          },
          effect: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default gloamspireBlackMarket;
