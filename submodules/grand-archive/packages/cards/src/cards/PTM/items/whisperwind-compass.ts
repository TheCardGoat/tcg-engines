import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const whisperwindCompass: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UXqhPZEq0X",
  slug: "whisperwind-compass",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UXqhPZEq0X:face:default",
      catalogId: "UXqhPZEq0X",
      name: "Whisperwind Compass",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\n[Class Bonus] Whenever a Ranger ally you control becomes distant, if that ally has no buff counters on it, put a buff counter on it.",
      abilities: [
        {
          id: "UXqhPZEq0X-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "UXqhPZEq0X-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever a Ranger ally you control becomes distant, if that ally has no buff counters on it, put a buff counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["RANGER"],
                    },
                  ],
                },
                bindAs: "distant-ranger",
              },
              state: "distant",
              to: true,
            },
          },
          interveningCondition: {
            kind: "not",
            condition: {
              kind: "has-counter",
              subject: {
                kind: "bound",
                binding: "distant-ranger",
              },
              counter: "buff",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "distant-ranger",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default whisperwindCompass;
