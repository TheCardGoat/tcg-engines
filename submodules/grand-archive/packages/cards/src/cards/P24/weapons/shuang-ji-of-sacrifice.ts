import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shuangJiOfSacrifice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y1tyo32voa",
  slug: "shuang-ji-of-sacrifice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y1tyo32voa:face:default",
      catalogId: "y1tyo32voa",
      name: "Shuang Ji of Sacrifice",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["EXIA"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Class Bonus] For every five damage counters on your champion, Shuang Ji of Sacrifice gets +1 POWER.\n\nOn Enter: You may have Shuang Ji of Sacrifice deal 5 unpreventable damage to your champion. If you do, draw a card.",
      abilities: [
        {
          id: "y1tyo32voa-a1",
          kind: "card-resolution",
          text: "[Class Bonus] For every five damage counters on your champion, Shuang Ji of Sacrifice gets +1 POWER.",
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
            kind: "repeat",
            count: {
              kind: "calculate",
              operator: "divide",
              operands: [
                {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "damage",
                },
                5,
              ],
              rounding: "down",
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "locked",
              duration: {
                kind: "permanent",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          },
        },
        {
          id: "y1tyo32voa-a2",
          kind: "triggered",
          text: "On Enter: You may have Shuang Ji of Sacrifice deal 5 unpreventable damage to your champion. If you do, draw a card.",
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
                  amount: 5,
                  preventable: false,
                },
                {
                  kind: "draw",
                  player: "controller",
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

export default shuangJiOfSacrifice;
