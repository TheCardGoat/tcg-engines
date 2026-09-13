import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const huajiOfHeavensRise: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v1iyt8rugx",
  slug: "huaji-of-heavens-rise",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "v1iyt8rugx:face:default",
      catalogId: "v1iyt8rugx",
      name: "Huaji of Heaven's Rise",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] Unique Warrior allies you control can attack using this weapon.\n\n[Class Bonus] At the beginning of your end phase, if your champion is exia element, you may pay (3). If you do, transform Huaji of Heaven's Rise.",
      abilities: [
        {
          id: "v1iyt8rugx-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Unique Warrior allies you control can attack using this weapon.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "attack",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "class",
                        oneOf: ["WARRIOR"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
                  },
                },
              },
              using: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "v1iyt8rugx-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your end phase, if your champion is exia element, you may pay (3). If you do, transform Huaji of Heaven's Rise.",
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
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "subject-matches",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    filter: {
                      kind: "element",
                      oneOf: ["EXIA"],
                    },
                  },
                  then: {
                    kind: "optional",
                    player: "controller",
                    allOrNothing: true,
                    effect: {
                      kind: "pay",
                      player: "controller",
                      cost: {
                        kind: "pay-reserve",
                        amount: 3,
                      },
                    },
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "transform",
                  subject: {
                    kind: "source",
                  },
                },
              },
            ],
          },
        },
      ],
    },
    flipFace: {
      id: "v1iyt8rugx:face:flip",
      catalogId: "reks5jzk7c",
      name: "Huaji of Abyssal Fall",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] Unique Warrior allies you control can attack using this weapon.\n\nOn Attack: You may have Huaji of Abyssal Fall deal 10 unpreventable damage to the attacker. If you do, this attack gets +3 POWER.",
      abilities: [
        {
          id: "reks5jzk7c-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Unique Warrior allies you control can attack using this weapon.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "attack",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "class",
                        oneOf: ["WARRIOR"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
                  },
                },
              },
              using: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "reks5jzk7c-a2",
          kind: "triggered",
          text: "On Attack: You may have Huaji of Abyssal Fall deal 10 unpreventable damage to the attacker. If you do, this attack gets +3 POWER.",
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
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "event-attacker",
                  },
                  amount: 10,
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

export default huajiOfHeavensRise;
