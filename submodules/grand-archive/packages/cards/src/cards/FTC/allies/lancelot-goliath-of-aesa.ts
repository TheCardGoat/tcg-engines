import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lancelotGoliathOfAesa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w9n0wpbhig",
  slug: "lancelot-goliath-of-aesa",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w9n0wpbhig:face:default",
      catalogId: "w9n0wpbhig",
      name: "Lancelot, Goliath of Aesa",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Hindered (This ally enters the field rested.) \n\n[Class Bonus] [Level 2+] Lancelot gets +2 LIFE.\n\nOn Attack: You may pay (3). If you do, Lancelot gets +3 POWER until end of turn.",
      abilities: [
        {
          id: "w9n0wpbhig-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This ally enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "w9n0wpbhig-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Lancelot gets +2 LIFE.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 2,
              },
            },
          ],
        },
        {
          id: "w9n0wpbhig-a3",
          kind: "triggered",
          text: "On Attack: You may pay (3). If you do, Lancelot gets +3 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                  kind: "pay",
                  player: "controller",
                  cost: {
                    kind: "pay-reserve",
                    amount: 3,
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
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
                    amount: 3,
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

export default lancelotGoliathOfAesa;
