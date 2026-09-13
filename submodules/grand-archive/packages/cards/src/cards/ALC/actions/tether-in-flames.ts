import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tetherInFlames: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "215upufyoz",
  slug: "tether-in-flames",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "215upufyoz:face:default",
      catalogId: "215upufyoz",
      name: "Tether in Flames",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nNegate target card activation unless its controller has Tether in Flames deal 1+LV unpreventable damage to their champion. (LV refers to your champion's level.)",
      abilities: [
        {
          id: "215upufyoz-a1",
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
          id: "215upufyoz-a2",
          kind: "card-resolution",
          text: "Negate target card activation unless its controller has Tether in Flames deal 1+LV unpreventable damage to their champion. (LV refers to your champion's level.)",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "unless-performed",
            player: {
              controllerOf: "target-stack-item",
            },
            alternative: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "champion",
                player: {
                  controllerOf: "target-stack-item",
                },
              },
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
              preventable: false,
            },
            otherwise: {
              kind: "negate",
              subject: {
                kind: "bound",
                binding: "target-stack-item",
              },
              bindResultAs: "negated-stack-item",
            },
          },
        },
      ],
    },
  },
};

export default tetherInFlames;
