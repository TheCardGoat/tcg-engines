import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const quietRefraction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4vZN8JlY2k",
  slug: "quiet-refraction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4vZN8JlY2k:face:default",
      catalogId: "4vZN8JlY2k",
      name: "Quiet Refraction",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory. Put two sheen counters on your Fractured Memories.\n\nWhenever your champion levels up, put two sheen counters on your Fractured Memories.",
      abilities: [
        {
          id: "4vZN8JlY2k-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory. Put two sheen counters on your Fractured Memories.",
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "name",
                      value: "Fractured Memories",
                    },
                  },
                },
                counter: {
                  named: "sheen",
                },
                amount: 2,
              },
            ],
          },
        },
        {
          id: "4vZN8JlY2k-a2",
          kind: "triggered",
          text: "Whenever your champion levels up, put two sheen counters on your Fractured Memories.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "name",
                  value: "Fractured Memories",
                },
              },
            },
            counter: {
              named: "sheen",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default quietRefraction;
