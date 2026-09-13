import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stolenChance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Ww12XlYHFA",
  slug: "stolen-chance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Ww12XlYHFA:face:default",
      catalogId: "Ww12XlYHFA",
      name: "Stolen Chance",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Remove a preparation counter from target champion. If a preparation counter was removed this way, draw a card.",
      abilities: [
        {
          id: "Ww12XlYHFA-a1",
          kind: "card-resolution",
          text: "Remove a preparation counter from target champion. If a preparation counter was removed this way, draw a card.",
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
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "preparation",
                amount: 1,
                bindResultAs: "removed-counters",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "modified-ability-result-amount",
                      metric: "counters-removed",
                    },
                    operator: "gt",
                    right: 0,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default stolenChance;
