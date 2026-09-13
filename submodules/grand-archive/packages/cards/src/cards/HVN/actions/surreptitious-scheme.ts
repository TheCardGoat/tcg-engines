import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surreptitiousScheme: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2bcammhx44",
  slug: "surreptitious-scheme",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2bcammhx44:face:default",
      catalogId: "2bcammhx44",
      name: "Surreptitious Scheme",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Remove a level counter from target champion. If level counter was removed this way, draw a card.",
      abilities: [
        {
          id: "2bcammhx44-a1",
          kind: "card-resolution",
          text: "Remove a level counter from target champion. If level counter was removed this way, draw a card.",
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
                counter: "level",
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

export default surreptitiousScheme;
