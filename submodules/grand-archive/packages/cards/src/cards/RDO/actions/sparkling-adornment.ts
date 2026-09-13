import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sparklingAdornment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "okZKM5DGRu",
  slug: "sparkling-adornment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "okZKM5DGRu:face:default",
      catalogId: "okZKM5DGRu",
      name: "Sparkling Adornment",
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
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, remove one or more sheen counters from an object on the field.\n\nPut X sheen counters on target unit, where X is the amount of counters removed.\n\n[Merlin Bonus] Floating Memory",
      abilities: [
        {
          id: "okZKM5DGRu-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, remove one or more sheen counters from an object on the field.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-remove-counters",
                player: "each-player",
                counter: {
                  named: "sheen",
                },
                count: {
                  kind: "at-least",
                  amount: 1,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "okZKM5DGRu-a2",
          kind: "card-resolution",
          text: "Put X sheen counters on target unit, where X is the amount of counters removed.",
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
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: {
              named: "sheen",
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
        {
          id: "okZKM5DGRu-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
        },
      ],
    },
  },
};

export default sparklingAdornment;
