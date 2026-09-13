import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spellshieldExia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CSVtYQIz7h",
  slug: "spellshield-exia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CSVtYQIz7h:face:default",
      catalogId: "CSVtYQIz7h",
      name: "Spellshield: Exia",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL", "REACTION"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nThe next time damage would be dealt to your champion this turn, prevent that damage and recover X instead, where X is the amount of damage prevented this way.",
      abilities: [
        {
          id: "CSVtYQIz7h-a1",
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
          id: "CSVtYQIz7h-a2",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent that damage and recover X instead, where X is the amount of damage prevented this way.",
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
            afterApply: {
              kind: "recover",
              player: "controller",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "damage-prevented",
              },
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
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

export default spellshieldExia;
