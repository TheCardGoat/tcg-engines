import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surgingBolt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "08kkz07nau",
  slug: "surging-bolt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "08kkz07nau:face:default",
      catalogId: "08kkz07nau",
      name: "Surging Bolt",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are fire element, this card becomes imbued.)\n\nDeal 3 damage to target champion. If Surging Bolt is imbued, deal 4 damage to that champion instead.",
      abilities: [
        {
          id: "08kkz07nau-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are fire element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "08kkz07nau-a2",
          kind: "card-resolution",
          text: "Deal 3 damage to target champion. If Surging Bolt is imbued, deal 4 damage to that champion instead.",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
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
              amount: 4,
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
            },
          },
        },
      ],
    },
  },
};

export default surgingBolt;
