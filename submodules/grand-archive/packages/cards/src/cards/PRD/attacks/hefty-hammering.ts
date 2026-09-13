import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heftyHammering: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ceqDwfTzFI",
  slug: "hefty-hammering",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ceqDwfTzFI:face:default",
      catalogId: "ceqDwfTzFI",
      name: "Hefty Hammering",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HAMMER", "CRAFT"],
      },
      elements: ["NORM"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] This card costs X less to activate, where X is the amount of durability counters on a weapon you control with the most durability counters on it.\n\n[Class Bonus] Floating Memory\n\n",
      abilities: [
        {
          id: "ceqDwfTzFI-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs X less to activate, where X is the amount of durability counters on a weapon you control with the most durability counters on it.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-counter-count",
                operation: "maximum",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                },
                counter: "durability",
                emptyValue: 0,
              },
            },
          ],
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
              amount: {
                kind: "aggregate-counter-count",
                operation: "maximum",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                },
                counter: "durability",
                emptyValue: 0,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ceqDwfTzFI-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
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
        },
      ],
    },
  },
};

export default heftyHammering;
