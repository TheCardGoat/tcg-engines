import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sinkTheMind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yrzexkW5Ej",
  slug: "sink-the-mind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yrzexkW5Ej:face:default",
      catalogId: "yrzexkW5Ej",
      name: "Sink the Mind",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. \n\nActivate this card only during an opponent's recollection phase. \n\nUntil end of turn, whenever a card from the turn player's memory is put into their hand, that player puts the top card of their deck into their graveyard.",
      abilities: [
        {
          id: "yrzexkW5Ej-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "yrzexkW5Ej-a2",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's recollection phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "recollection",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "yrzexkW5Ej-a3",
          kind: "card-resolution",
          text: "Until end of turn, whenever a card from the turn player's memory is put into their hand, that player puts the top card of their deck into their graveyard.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "card-moved",
                actor: "turn-player",
                subject: {
                  kind: "event-object",
                },
                from: "memory",
                to: "hand",
              },
            },
            effect: {
              kind: "mill",
              player: "event-actor",
              amount: 1,
            },
            expires: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default sinkTheMind;
