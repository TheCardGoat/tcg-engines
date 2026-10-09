import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const collapsingTrap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v2214upufo",
  slug: "collapsing-trap",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v2214upufo:face:default",
      catalogId: "v2214upufo",
      name: "Collapsing Trap",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] If it’s not your turn, you may remove a preparation counter from your champion to activate this card from your memory without paying its reserve cost. \n\nThe next time one or more allies would enter the field this turn, they enter the field rested instead.",
      abilities: [
        {
          id: "v2214upufo-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If it’s not your turn, you may remove a preparation counter from your champion to activate this card from your memory without paying its reserve cost.",
          functionalZones: ["memory"],
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
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "memory",
              condition: {
                kind: "not",
                condition: {
                  kind: "turn-player",
                  player: "controller",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "memory",
              costKind: "reserve",
              cost: {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
              condition: {
                kind: "not",
                condition: {
                  kind: "turn-player",
                  player: "controller",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "v2214upufo-a2",
          kind: "card-resolution",
          text: "The next time one or more allies would enter the field this turn, they enter the field rested instead.",
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            operation: {
              kind: "modify-object-state",
              state: "rested",
              value: true,
            },
            duration: {
              kind: "for-next-event",
              event: "object-entered-field",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default collapsingTrap;
