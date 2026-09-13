import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const whirlwindReaper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x7yc0ije4d",
  slug: "whirlwind-reaper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x7yc0ije4d:face:default",
      catalogId: "x7yc0ije4d",
      name: "Whirlwind Reaper",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "At the beginning of your end phase, you may remove a preparation counter from your champion. If you do, wake up Whirlwind Reaper.",
      abilities: [
        {
          id: "x7yc0ije4d-a1",
          kind: "triggered",
          text: "At the beginning of your end phase, you may remove a preparation counter from your champion. If you do, wake up Whirlwind Reaper.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "remove-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                  amount: 1,
                  bindResultAs: "removed-counters",
                },
                {
                  kind: "wake",
                  subject: {
                    kind: "source",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default whirlwindReaper;
