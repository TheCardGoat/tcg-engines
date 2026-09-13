import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crystalAccretion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HDeEE7YPTl",
  slug: "crystal-accretion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HDeEE7YPTl:face:default",
      catalogId: "HDeEE7YPTl",
      name: "Crystal Accretion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Put a sheen counter on each unit with a sheen counter on it.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "HDeEE7YPTl-a1",
          kind: "card-resolution",
          text: "Put a sheen counter on each unit with a sheen counter on it.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "has-counter",
                      counter: {
                        named: "sheen",
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: {
              named: "sheen",
            },
            amount: 1,
          },
        },
        {
          id: "HDeEE7YPTl-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default crystalAccretion;
