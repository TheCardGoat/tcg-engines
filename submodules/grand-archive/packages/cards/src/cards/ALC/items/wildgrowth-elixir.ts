import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wildgrowthElixir: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tjot4nmxqs",
  slug: "wildgrowth-elixir",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tjot4nmxqs:face:default",
      catalogId: "tjot4nmxqs",
      name: "Wildgrowth Elixir",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Brew — Two Herbs\n\nAt the beginning of your recollection phase, put an age counter on Wildgrowth Elixir.\n\nSacrifice Wildgrowth Elixir: Put X buff counters on target ally, where X is the amount of age counters on Wildgrowth Elixir.",
      abilities: [
        {
          id: "tjot4nmxqs-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Herbs",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 2,
              },
            ],
          },
        },
        {
          id: "tjot4nmxqs-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put an age counter on Wildgrowth Elixir.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "age",
            },
            amount: 1,
          },
        },
        {
          id: "tjot4nmxqs-a3",
          kind: "activated",
          text: "Sacrifice Wildgrowth Elixir: Put X buff counters on target ally, where X is the amount of age counters on Wildgrowth Elixir.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "age",
                },
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default wildgrowthElixir;
