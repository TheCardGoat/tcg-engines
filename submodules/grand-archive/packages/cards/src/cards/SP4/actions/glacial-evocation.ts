import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const glacialEvocation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mr1lmsbjcf",
  slug: "glacial-evocation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mr1lmsbjcf:face:default",
      catalogId: "mr1lmsbjcf",
      name: "Glacial Evocation",
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
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 damage to target ally. If that unit is rested, deal 3 damage to it instead.",
      abilities: [
        {
          id: "mr1lmsbjcf-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target ally. If that unit is rested, deal 3 damage to it instead.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              state: "rested",
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
            },
          },
        },
      ],
    },
  },
};

export default glacialEvocation;
