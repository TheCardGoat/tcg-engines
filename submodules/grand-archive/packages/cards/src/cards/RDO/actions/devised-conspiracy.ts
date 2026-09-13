import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const devisedConspiracy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dih0LPaigc",
  slug: "devised-conspiracy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dih0LPaigc:face:default",
      catalogId: "dih0LPaigc",
      name: "Devised Conspiracy",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Tristan Bonus] Prepare 2\n\nYour champion's next attack this turn gets +2POWER. If Devised Conspiracy was prepared, until end of turn, your champion and allies you control named Ominous Shadow gain \"On Champion Hit: Banish the top card of that player's deck face down. As long as it's banished, you may play it, ignoring its elemental requirements.\"",
      abilities: [
        {
          id: "dih0LPaigc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Tristan Bonus] Prepare 2",
          keyword: {
            name: "prepare",
            value: 2,
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tristan",
              },
            },
          ],
        },
        {
          id: "dih0LPaigc-a2",
          kind: "card-resolution",
          text: "Your champion's next attack this turn gets +2POWER. If Devised Conspiracy was prepared, until end of turn, your champion and allies you control named Ominous Shadow gain \"On Champion Hit: Banish the top card of that player's deck face down. As long as it's banished, you may play it, ignoring its elemental requirements.\"",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-declared",
                    subject: {
                      kind: "event-object",
                      controller: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                  },
                },
                limit: 1,
                expires: {
                  kind: "this-turn",
                },
                effect: {
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
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "prepared",
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "any",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                          {
                            kind: "all",
                            filters: [
                              {
                                kind: "type",
                                oneOf: ["ALLY"],
                              },
                              {
                                kind: "name",
                                value: "Ominous Shadow",
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-ability",
                    ability: {
                      id: "granted-wvapqu-a1",
                      kind: "triggered",
                      text: "On Champion Hit: Banish the top card of that player's deck face down. As long as it's banished, you may play it, ignoring its elemental requirements.",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "attack-hit",
                          subject: {
                            kind: "ability-bearer",
                          },
                          recipient: {
                            kind: "event-object",
                            filter: {
                              kind: "type",
                              oneOf: ["CHAMPION"],
                            },
                          },
                        },
                      },
                      effect: {
                        kind: "sequence",
                        effects: [
                          {
                            kind: "banish",
                            player: "event-recipient-controller",
                            selection: {
                              id: "banished-hit-card",
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
                                zones: ["main-deck"],
                                relationship: "zone-of",
                                player: "event-recipient-controller",
                                fromTop: true,
                              },
                            },
                            faceDown: true,
                            bindResultAs: "banished-hit-card",
                          },
                          {
                            kind: "rule-modification",
                            mode: "allow",
                            action: "play",
                            subject: {
                              kind: "bound",
                              binding: "banished-hit-card",
                            },
                            fromZone: "banishment",
                            duration: {
                              kind: "while-subjects-in-zone",
                              subjects: {
                                kind: "bound",
                                binding: "banished-hit-card",
                              },
                              zone: "banishment",
                              scope: "per-object",
                            },
                          },
                          {
                            kind: "rule-modification",
                            mode: "allow",
                            action: "ignore-element-requirement",
                            subject: {
                              kind: "bound",
                              binding: "banished-hit-card",
                            },
                            fromZone: "banishment",
                            duration: {
                              kind: "while-subjects-in-zone",
                              subjects: {
                                kind: "bound",
                                binding: "banished-hit-card",
                              },
                              zone: "banishment",
                              scope: "per-object",
                            },
                          },
                        ],
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

export default devisedConspiracy;
