import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const byakkosCommand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l4rdualc8p",
  slug: "byakkos-command",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l4rdualc8p:face:default",
      catalogId: "l4rdualc8p",
      name: "Byakko's Command",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText: "Put a buff counter on target Beast ally. If that ally is a Shenju, wake it up.",
      abilities: [
        {
          id: "l4rdualc8p-a1",
          kind: "card-resolution",
          text: "Put a buff counter on target Beast ally. If that ally is a Shenju, wake it up.",
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BEAST"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "buff",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["SHENJU"],
                  },
                },
                then: {
                  kind: "wake",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default byakkosCommand;
