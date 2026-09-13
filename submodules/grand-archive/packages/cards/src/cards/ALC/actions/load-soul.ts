import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const loadSoul: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8tuhuy4xip",
  slug: "load-soul",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8tuhuy4xip:face:default",
      catalogId: "8tuhuy4xip",
      name: "Load Soul",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "CURSE", "SKILL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Materialize a Bullet card from your material deck, then you may put two durability counters on a Gun weapon you control. If you do, put Load Soul on the bottom of your champion's lineage.\n\nInherited Effect: This object gets -2 LIFE.",
      abilities: [
        {
          id: "8tuhuy4xip-a1",
          kind: "card-resolution",
          text: "Materialize a Bullet card from your material deck, then you may put two durability counters on a Gun weapon you control. If you do, put Load Soul on the bottom of your champion's lineage.",
          effect: {
            kind: "choose",
            selection: {
              id: "bullet-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["BULLET"],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "materialize-card",
                  subject: {
                    kind: "bound",
                    binding: "bullet-card",
                  },
                  payCosts: true,
                },
                {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "gun-weapon",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        relationship: "controlled-by",
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["WEAPON"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["GUN"],
                            },
                          ],
                        },
                      },
                    },
                    effect: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "add-counter",
                          subject: {
                            kind: "bound",
                            binding: "gun-weapon",
                          },
                          counter: "durability",
                          amount: 2,
                        },
                        {
                          kind: "move",
                          subject: {
                            kind: "source",
                          },
                          destination: {
                            zone: "inner-lineage",
                            host: {
                              kind: "champion",
                              player: "controller",
                            },
                            placement: {
                              kind: "bottom",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "8tuhuy4xip-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect: This object gets -2 LIFE.",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "ability-bearer",
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
                operation: "subtract",
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default loadSoul;
