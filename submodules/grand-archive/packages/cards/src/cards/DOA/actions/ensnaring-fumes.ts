import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ensnaringFumes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wPKxvzTmqq",
  slug: "ensnaring-fumes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wPKxvzTmqq:face:default",
      catalogId: "wPKxvzTmqq",
      name: "Ensnaring Fumes",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may remove three preparation counters from your champion rather than pay this card's reserve cost.\n\nReturn all allies to their owner's hands.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "wPKxvzTmqq-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may remove three preparation counters from your champion rather than pay this card's reserve cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 3,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "wPKxvzTmqq-a2",
          kind: "card-resolution",
          text: "Return all allies to their owner's hands.",
          effect: {
            kind: "move",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            destination: {
              zone: "hand",
            },
          },
        },
        {
          id: "wPKxvzTmqq-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default ensnaringFumes;
