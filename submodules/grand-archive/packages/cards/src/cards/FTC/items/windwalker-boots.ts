import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windwalkerBoots: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "73fdt8ptrz",
  slug: "windwalker-boots",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "73fdt8ptrz:face:default",
      catalogId: "73fdt8ptrz",
      name: "Windwalker Boots",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ACCESSORY"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "[Class Bonus] At the beginning of your end phase, if your champion is awake, put a preparation counter on them.\n\nBanish Windwalker Boots: Draw a card. Activate this ability only if your champion has five or more preparation counters on them.",
      abilities: [
        {
          id: "73fdt8ptrz-a1",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your end phase, if your champion is awake, put a preparation counter on them.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
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
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "champion",
                player: "controller",
              },
              state: "awake",
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
        {
          id: "73fdt8ptrz-a2",
          kind: "activated",
          text: "Banish Windwalker Boots: Draw a card. Activate this ability only if your champion has five or more preparation counters on them.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
              operator: "gte",
              right: 5,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default windwalkerBoots;
