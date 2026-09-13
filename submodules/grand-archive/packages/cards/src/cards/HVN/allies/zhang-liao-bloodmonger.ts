import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zhangLiaoBloodmonger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w822tmc0yc",
  slug: "zhang-liao-bloodmonger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w822tmc0yc:face:default",
      catalogId: "w822tmc0yc",
      name: "Zhang Liao, Bloodmonger",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "Taunt\n\nOn Enter: You may recover 3.\n\n[Class Bonus] At the beginning of your recollection phase, if your champion has zero damage counters on them, deal 20 unpreventable damage to your champion and draw three cards.",
      abilities: [
        {
          id: "w822tmc0yc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "w822tmc0yc-a2",
          kind: "triggered",
          text: "On Enter: You may recover 3.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "recover",
              player: "controller",
              amount: 3,
            },
          },
        },
        {
          id: "w822tmc0yc-a3",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, if your champion has zero damage counters on them, deal 20 unpreventable damage to your champion and draw three cards.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
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
              kind: "compare",
              comparison: {
                left: {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "damage",
                },
                operator: "eq",
                right: 0,
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: 20,
                  preventable: false,
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 3,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default zhangLiaoBloodmonger;
