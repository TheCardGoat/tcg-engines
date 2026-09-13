import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spellshieldArcane: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RUqtU0Lczf",
  slug: "spellshield-arcane",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RUqtU0Lczf:face:default",
      catalogId: "RUqtU0Lczf",
      name: "Spellshield: Arcane",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nThe next time damage would be dealt to your champion this turn, prevent that damage. Put an amount of enlighten counters on your champion equal to the amount of damage prevented this way.",
      abilities: [
        {
          id: "RUqtU0Lczf-a1",
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
          id: "RUqtU0Lczf-a2",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent that damage. Put an amount of enlighten counters on your champion equal to the amount of damage prevented this way.",
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
              kind: "add-counter",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "enlighten",
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

export default spellshieldArcane;
