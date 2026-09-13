import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const corhaziOutlook: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rw8qq1uwq8",
  slug: "corhazi-outlook",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rw8qq1uwq8:face:default",
      catalogId: "rw8qq1uwq8",
      name: "Corhazi Outlook",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: Put a preparation counter on your champion.\n\n[Class Bonus] Remove a preparation counter from your champion: Opponents can't activate cards this turn. Glimpse 1. Activate this ability only during your turn.",
      abilities: [
        {
          id: "rw8qq1uwq8-a1",
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
          id: "rw8qq1uwq8-a2",
          kind: "activated",
          text: "[Class Bonus] Remove a preparation counter from your champion: Opponents can't activate cards this turn. Glimpse 1. Activate this ability only during your turn.",
          activation: "ability",
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
            kind: "turn-player",
            player: "controller",
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
            kind: "sequence",
            effects: [
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "each-opponent",
                },
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default corhaziOutlook;
