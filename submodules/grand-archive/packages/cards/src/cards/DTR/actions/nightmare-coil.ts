import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nightmareCoil: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3fe3c97s71",
  slug: "nightmare-coil",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3fe3c97s71:face:default",
      catalogId: "3fe3c97s71",
      name: "Nightmare Coil",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only if your champion is distant, and only during your recollection phase.\n\n[Class Bonus] This card's activation can't be negated.\n\nDraw a card. Until end of turn, whenever an opponent activates a card or ability, that opponent's champion deals 8 unpreventable damage to itself.",
      abilities: [
        {
          id: "3fe3c97s71-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only if your champion is distant, and only during your recollection phase.",
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
                    kind: "object-state",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    state: "distant",
                  },
                  {
                    kind: "all",
                    conditions: [
                      {
                        kind: "phase",
                        phase: "recollection",
                      },
                      {
                        kind: "turn-player",
                        player: "controller",
                      },
                    ],
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
          id: "3fe3c97s71-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card's activation can't be negated.",
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
              mode: "forbid",
              action: "negate",
              against: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "3fe3c97s71-a3",
          kind: "card-resolution",
          text: "Draw a card. Until end of turn, whenever an opponent activates a card or ability, that opponent's champion deals 8 unpreventable damage to itself.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    anyOf: [
                      {
                        name: "card-activated",
                        actor: "opponent",
                      },
                      {
                        name: "ability-activated",
                        actor: "opponent",
                      },
                    ],
                  },
                },
                expires: {
                  kind: "this-turn",
                },
                effect: {
                  kind: "deal-damage",
                  source: {
                    kind: "champion",
                    player: "event-actor",
                  },
                  recipient: {
                    kind: "champion",
                    player: "event-actor",
                  },
                  amount: 8,
                  preventable: false,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default nightmareCoil;
