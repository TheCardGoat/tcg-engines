import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tristanAscendantShadow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sSIDPfkmkw",
  slug: "tristan-ascendant-shadow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sSIDPfkmkw:face:default",
      catalogId: "sSIDPfkmkw",
      name: "Tristan, Ascendant Shadow",
      lineageName: "Tristan",
      cost: {
        kind: "memory",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 4,
        life: 28,
      },
      rulesText:
        "Tristan Lineage\n(2025): Summon any amount of Ominous Shadow tokens. For the rest of the game, attack cards you own have “On Hit: You may rest and declare an attack with  a phantasial ally you control. If you do, put this card in that attacker’s intent.” Activate this ability only if Tristan is an Ascendant. ",
      abilities: [
        {
          id: "sSIDPfkmkw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Tristan Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Tristan",
          },
        },
        {
          id: "sSIDPfkmkw-a2",
          kind: "activated",
          text: "(2025): Summon any amount of Ominous Shadow tokens. For the rest of the game, attack cards you own have “On Hit: You may rest and declare an attack with  a phantasial ally you control. If you do, put this card in that attacker’s intent.” Activate this ability only if Tristan is an Ascendant.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2025,
          },
          condition: {
            kind: "all",
            conditions: [
              {
                kind: "champion-lineage-is",
                name: "Tristan",
              },
              {
                kind: "subject-matches",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                filter: {
                  kind: "subtype",
                  oneOf: ["ASCENDANT"],
                },
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "shadow-count",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "number",
                    minimum: 0,
                  },
                },
                trackAs: "shadow-count",
              },
              {
                kind: "summon",
                controller: "controller",
                object: "Ominous Shadow",
                amount: {
                  kind: "binding",
                  binding: "shadow-count",
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: [
                      "main-deck",
                      "hand",
                      "memory",
                      "graveyard",
                      "banishment",
                      "effects-stack",
                      "intent",
                    ],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ATTACK"],
                    },
                  },
                },
                affectedSet: "dynamic",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-cgbfm2-a1",
                    kind: "triggered",
                    text: "On Hit: You may rest and declare an attack with a phantasial ally you control. If you do, put this card in that attacker’s intent.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "attack-hit",
                        subject: {
                          kind: "ability-bearer",
                        },
                      },
                    },
                    effect: {
                      kind: "optional",
                      player: "controller",
                      allOrNothing: true,
                      effect: {
                        kind: "choose",
                        selection: {
                          id: "phantasia-attacker",
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
                                  oneOf: ["ALLY"],
                                },
                                {
                                  kind: "subtype",
                                  oneOf: ["PHANTASIA"],
                                },
                              ],
                            },
                          },
                        },
                        effect: {
                          kind: "declare-attack",
                          attacker: {
                            kind: "bound",
                            binding: "phantasia-attacker",
                          },
                          additional: true,
                          cost: {
                            kind: "rest",
                            subject: {
                              kind: "bound",
                              binding: "phantasia-attacker",
                            },
                          },
                          ifDeclared: {
                            kind: "move",
                            subject: {
                              kind: "ability-bearer",
                            },
                            destination: {
                              zone: "intent",
                              host: {
                                kind: "bound",
                                binding: "phantasia-attacker",
                              },
                            },
                          },
                        },
                      },
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

export default tristanAscendantShadow;
