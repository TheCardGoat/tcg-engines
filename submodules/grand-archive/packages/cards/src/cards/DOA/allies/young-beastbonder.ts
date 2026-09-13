import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const youngBeastbonder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NwswAHojeq",
  slug: "young-beastbonder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NwswAHojeq:face:default",
      catalogId: "NwswAHojeq",
      name: "Young Beastbonder",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Put a buff counter on another target ally you control. If that ally is a Beast, put two buff counters on it instead.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "NwswAHojeq-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put a buff counter on another target ally you control. If that ally is a Beast, put two buff counters on it instead.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
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
          effect: {
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              filter: {
                kind: "subtype",
                oneOf: ["BEAST"],
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: "buff",
              amount: 2,
            },
            else: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
        {
          id: "NwswAHojeq-a2",
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

export default youngBeastbonder;
