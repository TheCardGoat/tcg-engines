import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dongZhouFalseLiege: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lrbcgpny3d",
  slug: "dong-zhou-false-liege",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lrbcgpny3d:face:default",
      catalogId: "lrbcgpny3d",
      name: "Dong Zhou, False Liege",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN", "MAGE"],
        subtypes: ["GUARDIAN", "MAGE", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Intercept\n\n[Class Bonus] On Enter: You may rest Dong Zhou. If you do, choose two—\n• Deal 3 damage to all other allies.\n• Empower 3.\n• Dong Zhou gains vigor until end of turn.",
      abilities: [
        {
          id: "lrbcgpny3d-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "lrbcgpny3d-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may rest Dong Zhou. If you do, choose two—\n• Deal 3 damage to all other allies.\n• Empower 3.\n• Dong Zhou gains vigor until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
                  kind: "attempt",
                  effect: {
                    kind: "rest",
                    subject: {
                      kind: "source",
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "select-modes",
                    choose: {
                      kind: "exactly",
                      amount: 2,
                    },
                    modes: [
                      {
                        id: "mode-1",
                        text: "Deal 3 damage to all other allies.",
                        effect: {
                          kind: "deal-damage",
                          source: {
                            kind: "source",
                          },
                          recipient: {
                            kind: "each",
                            collection: {
                              zones: ["field"],
                              filter: {
                                kind: "all",
                                filters: [
                                  {
                                    kind: "type",
                                    oneOf: ["ALLY"],
                                  },
                                  {
                                    kind: "not-source",
                                  },
                                ],
                              },
                            },
                          },
                          amount: 3,
                        },
                      },
                      {
                        id: "mode-2",
                        text: "Empower 3.",
                        effect: {
                          kind: "keyword-action",
                          action: "empower",
                          amount: 3,
                        },
                      },
                      {
                        id: "mode-3",
                        text: "Dong Zhou gains vigor until end of turn",
                        effect: {
                          kind: "continuous",
                          subjects: {
                            kind: "source",
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
                            kind: "grant-keyword",
                            keyword: {
                              name: "vigor",
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
        },
      ],
    },
  },
};

export default dongZhouFalseLiege;
