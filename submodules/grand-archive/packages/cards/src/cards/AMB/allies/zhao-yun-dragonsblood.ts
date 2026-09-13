import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zhaoYunDragonsblood: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mwfrfo3wzq",
  slug: "zhao-yun-dragonsblood",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mwfrfo3wzq:face:default",
      catalogId: "mwfrfo3wzq",
      name: "Zhao Yun, Dragonsblood",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: You may have Zhao Yun deal 2 unpreventable damage to your champion. If you do, this attack gets +2 POWER.\n\n[Class Bonus] On Kill: Zhao Yun gains immortality. (This effect lasts indefinitely.)",
      abilities: [
        {
          id: "mwfrfo3wzq-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may have Zhao Yun deal 2 unpreventable damage to your champion. If you do, this attack gets +2 POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
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
                  amount: 2,
                  preventable: false,
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
                    amount: 2,
                  },
                },
              ],
            },
          },
        },
        {
          id: "mwfrfo3wzq-a2",
          kind: "triggered",
          text: "[Class Bonus] On Kill: Zhao Yun gains immortality. (This effect lasts indefinitely.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
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
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "permanent",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "immortality",
              },
            },
          },
        },
      ],
    },
  },
};

export default zhaoYunDragonsblood;
