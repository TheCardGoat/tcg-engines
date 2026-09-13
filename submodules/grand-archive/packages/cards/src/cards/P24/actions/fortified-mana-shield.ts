import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fortifiedManaShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5lh23qu7d6",
  slug: "fortified-mana-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5lh23qu7d6:face:default",
      catalogId: "5lh23qu7d6",
      name: "Fortified Mana Shield",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate if its activation targets a unit with taunt. (Apply this effect only if your champion's class matches this card's class.)\n\nThe next time target unit would take non-combat damage this turn, prevent 4 of that damage.",
      abilities: [
        {
          id: "5lh23qu7d6-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate if its activation targets a unit with taunt. (Apply this effect only if your champion's class matches this card's class.)",
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
              condition: {
                kind: "ability-target-matches",
                ability: "this",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
                quantifier: "any",
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
          id: "5lh23qu7d6-a2",
          kind: "card-resolution",
          text: "The next time target unit would take non-combat damage this turn, prevent 4 of that damage.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
              combatDamage: false,
            },
            operation: {
              kind: "prevent",
              amount: 4,
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

export default fortifiedManaShield;
