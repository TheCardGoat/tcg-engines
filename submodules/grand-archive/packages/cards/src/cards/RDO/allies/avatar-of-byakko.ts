import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const avatarOfByakko: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TjiH4U35bv",
  slug: "avatar-of-byakko",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TjiH4U35bv:face:default",
      catalogId: "TjiH4U35bv",
      name: "Avatar of Byakko",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "TIGER", "AVATAR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Guo Jia Bonus] As long as you control a Beast, Avatar of Byakko's base power is X, where X is the highest base power stat among Beast allies you control.\n\n[Guo Jia Bonus] (2), Sacrifice Avatar of Byakko: Put two quest counters on your champion. Then you may put a card named Fabled Emerald Fatestone from your material deck or banishment onto the field.",
      abilities: [
        {
          id: "TjiH4U35bv-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Guo Jia Bonus] As long as you control a Beast, Avatar of Byakko's base power is X, where X is the highest base power stat among Beast allies you control.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
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
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["BEAST"],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "A",
                modifies: "base-stats",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "set",
                amount: {
                  kind: "aggregate-property",
                  operation: "maximum",
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
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  },
                  property: "power",
                  basis: "base",
                  emptyValue: 0,
                },
              },
            },
          ],
        },
        {
          id: "TjiH4U35bv-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (2), Sacrifice Avatar of Byakko: Put two quest counters on your champion. Then you may put a card named Fabled Emerald Fatestone from your material deck or banishment onto the field.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
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
                amount: 2,
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "chosen-multi-zone-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      zones: ["material-deck", "banishment"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "name",
                        value: "Fabled Emerald Fatestone",
                      },
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "chosen-multi-zone-card",
                    },
                    destination: {
                      zone: "field",
                    },
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

export default avatarOfByakko;
