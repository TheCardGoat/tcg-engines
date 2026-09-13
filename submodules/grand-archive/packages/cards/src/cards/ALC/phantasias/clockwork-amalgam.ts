import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clockworkAmalgam: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3zc9p4lpnv",
  slug: "clockwork-amalgam",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3zc9p4lpnv:face:default",
      catalogId: "3zc9p4lpnv",
      name: "Clockwork Amalgam",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["GUARDIAN", "TAMER"],
        subtypes: ["GUARDIAN", "TAMER", "SPELL"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText:
        '[Class Bonus] This card costs 2 less to activate.\n\nClockwork Amalgam enters the field as a copy of any ally or weapon on the field except it has "At the beginning of your recollection phase, you may return this object to your hand."',
      abilities: [
        {
          id: "3zc9p4lpnv-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "3zc9p4lpnv-a2",
          kind: "static",
          staticKind: "effects",
          text: 'Clockwork Amalgam enters the field as a copy of any ally or weapon on the field except it has "At the beginning of your recollection phase, you may return this object to your hand."',
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "perform-before-commit",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "copied-object",
                    kind: "choice",
                    declared: "event-processing",
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
                        oneOf: ["ALLY", "WEAPON"],
                      },
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "become-copy",
                        subject: {
                          kind: "source",
                        },
                        copyOf: {
                          kind: "bound",
                          binding: "copied-object",
                        },
                        duration: {
                          kind: "permanent",
                        },
                      },
                      {
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
                          kind: "grant-ability",
                          ability: {
                            id: "granted-kaobkz-a1",
                            kind: "triggered",
                            text: "At the beginning of your recollection phase, you may return this object to your hand.",
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
                                kind: "move",
                                subject: {
                                  kind: "ability-bearer",
                                },
                                destination: {
                                  zone: "hand",
                                },
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default clockworkAmalgam;
