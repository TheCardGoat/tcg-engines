import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fireball: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RIVahUIQVD",
  slug: "fireball",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RIVahUIQVD:face:default",
      catalogId: "RIVahUIQVD",
      name: "Fireball",
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
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nDeal 1+LV damage to target unit. (LV refers to your champion's level.)",
      abilities: [
        {
          id: "RIVahUIQVD-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
          id: "RIVahUIQVD-a2",
          kind: "card-resolution",
          text: "Deal 1+LV damage to target unit. (LV refers to your champion's level.)",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
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
          },
        },
      ],
    },
  },
};

export default fireball;
