import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const recurringInvocation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iyhlctxcrq",
  slug: "recurring-invocation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iyhlctxcrq:face:default",
      catalogId: "iyhlctxcrq",
      name: "Recurring Invocation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.) \n\n[Class Bonus] Whenever your champion levels up, you may banish this card from your graveyard and pay (1). If you do, empower 2.",
      abilities: [
        {
          id: "iyhlctxcrq-a1",
          kind: "card-resolution",
          text: "Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 2,
          },
        },
        {
          id: "iyhlctxcrq-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever your champion levels up, you may banish this card from your graveyard and pay (1). If you do, empower 2.",
          functionalZones: ["graveyard"],
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "banish-object",
                        subject: {
                          kind: "source",
                        },
                        from: "graveyard",
                      },
                      {
                        kind: "pay",
                        player: "controller",
                        cost: {
                          kind: "pay-reserve",
                          amount: 1,
                        },
                      },
                    ],
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "keyword-action",
                    action: "empower",
                    amount: 2,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default recurringInvocation;
