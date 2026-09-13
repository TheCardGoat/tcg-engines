import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const delusionalVapors: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2ghdzy9tz7",
  slug: "delusional-vapors",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2ghdzy9tz7:face:default",
      catalogId: "2ghdzy9tz7",
      name: "Delusional Vapors",
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
        "[Class Bonus] Prepare 2\n\nTarget opponent puts the top eight cards of their deck into their graveyard. Then if Delusional Vapors was prepared, whenever that opponent draws a card this turn, they put the top four cards of their deck into their graveyard.",
      abilities: [
        {
          id: "2ghdzy9tz7-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Prepare 2",
          keyword: {
            name: "prepare",
            value: 2,
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
        {
          id: "2ghdzy9tz7-a2",
          kind: "card-resolution",
          text: "Target opponent puts the top eight cards of their deck into their graveyard. Then if Delusional Vapors was prepared, whenever that opponent draws a card this turn, they put the top four cards of their deck into their graveyard.",
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "mill",
                player: {
                  binding: "target-opponent",
                },
                amount: 8,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "prepared",
                },
                then: {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "card-drawn",
                      actor: {
                        binding: "target-opponent",
                      },
                    },
                  },
                  effect: {
                    kind: "mill",
                    player: {
                      binding: "target-opponent",
                    },
                    amount: 4,
                  },
                  expires: {
                    kind: "this-turn",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default delusionalVapors;
