import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const coriolisWard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cagz0393zq",
  slug: "coriolis-ward",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cagz0393zq:face:default",
      catalogId: "cagz0393zq",
      name: "Coriolis Ward",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 1+LV damage that would be dealt to target unit this turn. (LV refers to your champion's level.)\n\nIf your Shifting Currents face West, draw a card into your memory.",
      abilities: [
        {
          id: "cagz0393zq-a1",
          kind: "card-resolution",
          text: "Prevent the next 1+LV damage that would be dealt to target unit this turn. (LV refers to your champion's level.)",
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
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  1,
                  {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                ],
              },
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "cagz0393zq-a2",
          kind: "card-resolution",
          text: "If your Shifting Currents face West, draw a card into your memory.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-state",
              player: "controller",
              state: {
                named: "shifting-currents",
                value: "West",
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default coriolisWard;
