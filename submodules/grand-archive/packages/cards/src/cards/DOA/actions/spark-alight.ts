import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sparkAlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "L9yBqoOshh",
  slug: "spark-alight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "L9yBqoOshh:face:default",
      catalogId: "L9yBqoOshh",
      name: "Spark Alight",
      cost: {
        kind: "reserve",
        amount: 2,
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
        "Deal 2 unpreventable damage to target unit. Class Bonus: Deal 3 unpreventable damage to that unit instead. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "L9yBqoOshh-a1",
          kind: "card-resolution",
          text: "Deal 2 unpreventable damage to target unit. Class Bonus: Deal 3 unpreventable damage to that unit instead. (Apply the additional effect only if your champion's class matches this card's class.)",
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
            kind: "conditional",
            condition: {
              kind: "champion-matches-source",
              characteristic: "class",
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 3,
              preventable: false,
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 2,
              preventable: false,
            },
          },
        },
      ],
    },
  },
};

export default sparkAlight;
