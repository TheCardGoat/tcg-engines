import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const weakenResistance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bb3oeup7oq",
  slug: "weaken-resistance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bb3oeup7oq:face:default",
      catalogId: "bb3oeup7oq",
      name: "Weaken Resistance",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nThe next time target unit would take damage from a Spell source this turn, it takes that much damage plus LV instead. (LV refers to your champion's level, calculated as this effect resolves.)",
      abilities: [
        {
          id: "bb3oeup7oq-a1",
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
          id: "bb3oeup7oq-a2",
          kind: "card-resolution",
          text: "The next time target unit would take damage from a Spell source this turn, it takes that much damage plus LV instead. (LV refers to your champion's level, calculated as this effect resolves.)",
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
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
            operation: {
              kind: "modify-amount",
              operation: "add",
              amount: {
                kind: "property",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                property: "level",
                basis: "current",
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

export default weakenResistance;
