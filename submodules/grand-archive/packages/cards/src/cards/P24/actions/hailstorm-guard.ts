import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hailstormGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "05qzzadf9q",
  slug: "hailstorm-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "05qzzadf9q:face:default",
      catalogId: "05qzzadf9q",
      name: "Hailstorm Guard",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nThe next time damage would be dealt to your champion this turn, prevent that damage. Put an amount of cards from the top of your deck into your graveyard equal to the amount of damage prevented this way.",
      abilities: [
        {
          id: "05qzzadf9q-a1",
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
          id: "05qzzadf9q-a2",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent that damage. Put an amount of cards from the top of your deck into your graveyard equal to the amount of damage prevented this way.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
            afterApply: {
              kind: "mill",
              player: "controller",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "damage-prevented",
              },
            },
          },
        },
      ],
    },
  },
};

export default hailstormGuard;
