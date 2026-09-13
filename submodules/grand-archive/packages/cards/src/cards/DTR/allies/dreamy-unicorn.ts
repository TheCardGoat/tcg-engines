import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dreamyUnicorn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ty0tcpdiny",
  slug: "dreamy-unicorn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ty0tcpdiny:face:default",
      catalogId: "ty0tcpdiny",
      name: "Dreamy Unicorn",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ANIMAL", "HUMAN", "UNICORN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nOn Death: Put a preparation counter on your champion.",
      abilities: [
        {
          id: "ty0tcpdiny-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "ty0tcpdiny-a2",
          kind: "triggered",
          text: "On Death: Put a preparation counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default dreamyUnicorn;
