import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gearstrideAcademy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lxnq80yu75",
  slug: "gearstride-academy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lxnq80yu75:face:default",
      catalogId: "lxnq80yu75",
      name: "Gearstride Academy",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CASTLE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Wind ally cards you activate have imbue 2.\n\nWind allies you control have “On Enter: If this ally is imbued, it gets +1 POWER until end of turn.”\n\nUpkeep — At the beginning of your recollection phase, you may pay (1). If you don’t, sacrifice Gearstride Academy.",
      abilities: [
        {
          id: "lxnq80yu75-a1",
          kind: "static",
          staticKind: "effects",
          text: "Wind ally cards you activate have imbue 2.",
          effects: [
            {
              kind: "rule-modification",
              mode: "grant-keyword",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["WIND"],
                  },
                ],
              },
              grantedKeyword: {
                name: "imbue",
                value: 2,
                elementRequirement: "source-elements",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "lxnq80yu75-a2",
          kind: "static",
          staticKind: "effects",
          text: "Wind allies you control have “On Enter: If this ally is imbued, it gets +1 POWER until end of turn.”",
          effects: [
            {
              kind: "continuous",
              subjects: {
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
                        kind: "subtype",
                        oneOf: ["WIND"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-1tum81l-a1",
                  kind: "triggered",
                  text: "On Enter: If this ally is imbued, it gets +1 POWER until end of turn.",
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
                    kind: "conditional",
                    condition: {
                      kind: "activation-state",
                      state: "imbued",
                    },
                    then: {
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
                        amount: 1,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          id: "lxnq80yu75-a3",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, you may pay (1). If you don’t, sacrifice Gearstride Academy.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "pay",
              player: "controller",
              cost: {
                kind: "pay-reserve",
                amount: 1,
              },
            },
            otherwise: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          },
          label: {
            name: "Upkeep",
          },
        },
      ],
    },
  },
};

export default gearstrideAcademy;
