import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const whirlwindThreads: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p7nkdqnzzg",
  slug: "whirlwind-threads",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p7nkdqnzzg:face:default",
      catalogId: "p7nkdqnzzg",
      name: "Whirlwind Threads",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Put a quest counter on your champion. \nIf an object was suppressed this turn, put Whirlwind Threads into your memory.",
      abilities: [
        {
          id: "p7nkdqnzzg-a1",
          kind: "card-resolution",
          text: "Put a quest counter on your champion.\nIf an object was suppressed this turn, put Whirlwind Threads into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "quest",
                },
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "history",
                  event: "keyword-action-performed",
                  window: "this-turn",
                  keywordAction: "suppress",
                  minimum: 1,
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "memory",
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

export default whirlwindThreads;
