import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dormouseInformant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aWjXOw4mVK",
  slug: "dormouse-informant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aWjXOw4mVK:face:default",
      catalogId: "aWjXOw4mVK",
      name: "Dormouse Informant",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "TAMER"],
        subtypes: ["ASSASSIN", "TAMER", "ANIMAL", "MOUSE"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "On Enter: If your champion has no preparation counters on them, put a preparation counter on them.",
      abilities: [
        {
          id: "aWjXOw4mVK-a1",
          kind: "triggered",
          text: "On Enter: If your champion has no preparation counters on them, put a preparation counter on them.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                },
                operator: "eq",
                right: 0,
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "preparation",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default dormouseInformant;
