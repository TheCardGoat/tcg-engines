import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wickedGildbreaker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YZQ8JOHehb",
  slug: "wicked-gildbreaker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YZQ8JOHehb:face:default",
      catalogId: "YZQ8JOHehb",
      name: "Wicked Gildbreaker",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "WARRIOR"],
        subtypes: ["ASSASSIN", "WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "As long as an opponent has influence nine or more, Wicked Gildbreaker has stealth and vigor. (A player’s influence is equal to the total amount of cards in their hand and memory.)\n\nOn Enter: If an opponent has influence eight or more, put a buff counter on Wicked Gildbreaker.",
      abilities: [
        {
          id: "YZQ8JOHehb-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as an opponent has influence nine or more, Wicked Gildbreaker has stealth and vigor. (A player’s influence is equal to the total amount of cards in their hand and memory.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-property-compare",
                players: "each-opponent",
                quantifier: "any",
                property: "influence",
                operator: "gte",
                value: 9,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "stealth",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-property-compare",
                players: "each-opponent",
                quantifier: "any",
                property: "influence",
                operator: "gte",
                value: 9,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "vigor",
                },
              },
            },
          ],
        },
        {
          id: "YZQ8JOHehb-a2",
          kind: "triggered",
          text: "On Enter: If an opponent has influence eight or more, put a buff counter on Wicked Gildbreaker.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-property-compare",
              players: "each-opponent",
              quantifier: "any",
              property: "influence",
              operator: "gte",
              value: 8,
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default wickedGildbreaker;
