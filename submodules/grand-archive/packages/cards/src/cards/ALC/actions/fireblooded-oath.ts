import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const firebloodedOath: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bmoqk2c7wk",
  slug: "fireblooded-oath",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bmoqk2c7wk:face:default",
      catalogId: "bmoqk2c7wk",
      name: "Fireblooded Oath",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nAs an additional cost to activate this card, banish three fire element cards from your graveyard.\n\nLevel up your champion. At the beginning of the next end phase, delevel your champion.",
      abilities: [
        {
          id: "bmoqk2c7wk-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
          id: "bmoqk2c7wk-a2",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish three fire element cards from your graveyard.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 3,
                },
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "bmoqk2c7wk-a3",
          kind: "card-resolution",
          text: "Level up your champion. At the beginning of the next end phase, delevel your champion.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "level-up",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "end",
                  },
                },
                effect: {
                  kind: "delevel",
                  subject: {
                    kind: "champion",
                    player: "controller",
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

export default firebloodedOath;
