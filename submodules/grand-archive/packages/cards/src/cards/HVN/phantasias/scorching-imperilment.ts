import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scorchingImperilment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aj7pz79wsp",
  slug: "scorching-imperilment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aj7pz79wsp:face:default",
      catalogId: "aj7pz79wsp",
      name: "Scorching Imperilment",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nAt the beginning of each player's end phase, that player may discard a card. If they do, they draw a card.\n",
      abilities: [
        {
          id: "aj7pz79wsp-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "aj7pz79wsp-a2",
          kind: "triggered",
          text: "At the beginning of each player's end phase, that player may discard a card. If they do, they draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
            },
          },
          effect: {
            kind: "optional",
            player: "event-actor",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "discard",
                  player: "event-actor",
                  selection: {
                    id: "event-player-discard",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "event-actor",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "event-actor",
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "event-actor",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default scorchingImperilment;
