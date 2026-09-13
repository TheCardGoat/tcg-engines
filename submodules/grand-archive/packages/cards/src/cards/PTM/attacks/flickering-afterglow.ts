import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flickeringAfterglow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tng0Gpe9mI",
  slug: "flickering-afterglow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tng0Gpe9mI:face:default",
      catalogId: "tng0Gpe9mI",
      name: "Flickering Afterglow",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Merlin Bonus] This card costs 1 less to activate for each sheen counter on your Fractured Memories.",
      abilities: [
        {
          id: "tng0Gpe9mI-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Merlin Bonus] This card costs 1 less to activate for each sheen counter on your Fractured Memories.",
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
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "sum-counters",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "name",
                        value: "Fractured Memories",
                      },
                    },
                    counter: {
                      named: "sheen",
                    },
                  },
                  1,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default flickeringAfterglow;
