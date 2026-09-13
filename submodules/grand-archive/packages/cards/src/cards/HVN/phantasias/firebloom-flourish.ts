import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const firebloomFlourish: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "prbwzihwyh",
  slug: "firebloom-flourish",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "prbwzihwyh:face:default",
      catalogId: "prbwzihwyh",
      name: "Firebloom Flourish",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Class Bonus] At the beginning of your recollection phase, deal 1 damage to target champion.\n\n[Diao Chan Bonus] At the beginning of your end phase, if your influence is four or less, draw a card into your memory and put a glimmer counter on your champion.",
      abilities: [
        {
          id: "prbwzihwyh-a1",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, deal 1 damage to target champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 1,
          },
        },
        {
          id: "prbwzihwyh-a2",
          kind: "triggered",
          text: "[Diao Chan Bonus] At the beginning of your end phase, if your influence is four or less, draw a card into your memory and put a glimmer counter on your champion.",
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
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "player-property",
                  player: "controller",
                  property: "influence",
                },
                operator: "lte",
                right: 4,
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: {
                    named: "glimmer",
                  },
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default firebloomFlourish;
