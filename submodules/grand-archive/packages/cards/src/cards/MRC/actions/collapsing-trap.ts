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
          kind: "card-resolution",
          text: "[Class Bonus] If it’s not your turn, you may remove a preparation counter from your champion to activate this card from your memory without paying its reserve cost.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
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
            kind: "conditional",
            condition: {
              kind: "turn-player",
              player: "opponent",
            },
            then: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "remove-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "preparation",
                amount: 1,
                bindResultAs: "removed-counters",
              },
            },
          },
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
