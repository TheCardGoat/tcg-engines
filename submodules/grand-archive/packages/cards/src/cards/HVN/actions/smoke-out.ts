import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const smokeOut: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vjonmi9jjq",
  slug: "smoke-out",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vjonmi9jjq:face:default",
      catalogId: "vjonmi9jjq",
      name: "Smoke Out",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 1 damage to target unit. If that unit has stealth, deal 4 damage to it instead.",
      abilities: [
        {
          id: "vjonmi9jjq-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit. If that unit has stealth, deal 4 damage to it instead.",
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
              kind: "subject-matches",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              filter: {
                kind: "has-keyword",
                keyword: "stealth",
              },
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
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default smokeOut;
