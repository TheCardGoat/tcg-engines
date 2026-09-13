import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spallingCleanse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t3Yb097xpJ",
  slug: "spalling-cleanse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t3Yb097xpJ:face:default",
      catalogId: "t3Yb097xpJ",
      name: "Spalling Cleanse",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "If your Fractured Memories has six or less sheen counters on it, put two sheen counters on it. Otherwise, recover 3. (If you don't have the mastery, recover 3.)\n\nFloating Memory",
      abilities: [
        {
          id: "t3Yb097xpJ-a1",
          kind: "card-resolution",
          text: "If your Fractured Memories has six or less sheen counters on it, put two sheen counters on it. Otherwise, recover 3. (If you don't have the mastery, recover 3.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "mastery-has-counter",
              mastery: "Fractured Memories",
              counter: {
                named: "sheen",
              },
              minimum: 0,
            },
            then: {
              kind: "conditional",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "mastery",
                  player: "controller",
                  name: "Fractured Memories",
                },
                counter: {
                  named: "sheen",
                },
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "mastery",
                      player: "controller",
                      name: "Fractured Memories",
                    },
                    counter: {
                      named: "sheen",
                    },
                  },
                  operator: "lte",
                  right: 6,
                },
              },
              then: {
                kind: "add-counter",
                subject: {
                  kind: "mastery",
                  player: "controller",
                  name: "Fractured Memories",
                },
                counter: {
                  named: "sheen",
                },
                amount: 2,
              },
              else: {
                kind: "recover",
                player: "controller",
                amount: 3,
              },
            },
            else: {
              kind: "recover",
              player: "controller",
              amount: 3,
            },
          },
        },
        {
          id: "t3Yb097xpJ-a2",
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

export default spallingCleanse;
