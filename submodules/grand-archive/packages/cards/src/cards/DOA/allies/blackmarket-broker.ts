import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blackmarketBroker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hHVf5xyjob",
  slug: "blackmarket-broker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hHVf5xyjob:face:default",
      catalogId: "hHVf5xyjob",
      name: "Blackmarket Broker",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "On Enter: Put a preparation counter on your champion.\n\nBlackmarket Broker has stealth as long as your champion has three or more preparation counters on them.",
      abilities: [
        {
          id: "hHVf5xyjob-a1",
          kind: "triggered",
          text: "On Enter: Put a preparation counter on your champion.",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
        {
          id: "hHVf5xyjob-a2",
          kind: "static",
          staticKind: "effects",
          text: "Blackmarket Broker has stealth as long as your champion has three or more preparation counters on them.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "preparation",
                  },
                  operator: "gte",
                  right: 3,
                },
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
          ],
        },
      ],
    },
  },
};

export default blackmarketBroker;
