import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blazeAlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iyvrYzBHVg",
  slug: "blaze-alight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iyvrYzBHVg:face:default",
      catalogId: "iyvrYzBHVg",
      name: "Blaze Alight",
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
      elements: ["EXALTED", "FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 3 unpreventable damage to target unit. Class Bonus: Deal 5 unpreventable damage to that unit instead. (Apply the additional effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "iyvrYzBHVg-a1",
          kind: "card-resolution",
          text: "Deal 3 unpreventable damage to target unit. Class Bonus: Deal 5 unpreventable damage to that unit instead. (Apply the additional effect only if your champion’s class matches this card’s class.)",
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
              amount: 5,
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
              amount: 3,
              preventable: false,
            },
          },
        },
      ],
    },
  },
};

export default blazeAlight;
