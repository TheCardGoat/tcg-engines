import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hemorrhagedIntimidation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PR4OkzJBVr",
  slug: "hemorrhaged-intimidation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PR4OkzJBVr:face:default",
      catalogId: "PR4OkzJBVr",
      name: "Hemorrhaged Intimidation",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent's recollection phase.\n\nDraw a card into your memory. \n\n[Class Bonus] The next card your opponent activates this turn costs (1) more to activate for every eight damage counters on your champion.",
      abilities: [
        {
          id: "PR4OkzJBVr-a1",
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
          id: "PR4OkzJBVr-a2",
          kind: "card-resolution",
          text: "Draw a card into your memory.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "PR4OkzJBVr-a3",
          kind: "card-resolution",
          text: "[Class Bonus] The next card your opponent activates this turn costs (1) more to activate for every eight damage counters on your champion.",
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
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "opponent",
            },
            costKind: "reserve",
            costOperation: "add",
            amount: {
              kind: "calculate",
              operator: "divide",
              operands: [
                {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "damage",
                },
                8,
              ],
              rounding: "down",
            },
            duration: {
              kind: "for-next-event",
              event: "card-activated",
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

export default hemorrhagedIntimidation;
