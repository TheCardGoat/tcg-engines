import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enPassant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pZAA0nHyXM",
  slug: "en-passant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pZAA0nHyXM:face:default",
      catalogId: "pZAA0nHyXM",
      name: "En Passant",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "COMMAND"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        'Command Chessman (A Chessman ally you control performs this attack.)\n\nAs long as a Chessman Pawn ally is attacking with En Passant, it has "On Kill: If there are no buff counters on this ally, put two buff counters on it."',
      abilities: [
        {
          id: "pZAA0nHyXM-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman (A Chessman ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Chessman",
          },
        },
        {
          id: "pZAA0nHyXM-a2",
          kind: "static",
          staticKind: "effects",
          text: 'As long as a Chessman Pawn ally is attacking with En Passant, it has "On Kill: If there are no buff counters on this ally, put two buff counters on it."',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "related",
                subject: {
                  kind: "source",
                },
                relation: "attacker",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "subject-matches",
                    subject: {
                      kind: "related",
                      subject: {
                        kind: "source",
                      },
                      relation: "attacker",
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
                          oneOf: ["CHESSMAN", "PAWN"],
                        },
                      ],
                    },
                  },
                  {
                    kind: "combat-relation",
                    relation: "attacking",
                    subject: {
                      kind: "related",
                      subject: {
                        kind: "source",
                      },
                      relation: "attacker",
                    },
                    using: {
                      kind: "source",
                    },
                  },
                ],
              },
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
                  id: "granted-1wv2xtu-a1",
                  kind: "triggered",
                  text: "On Kill: If there are no buff counters on this ally, put two buff counters on it.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "object-killed",
                      subject: {
                        kind: "ability-bearer",
                      },
                    },
                  },
                  interveningCondition: {
                    kind: "not",
                    condition: {
                      kind: "has-counter",
                      subject: {
                        kind: "ability-bearer",
                      },
                      counter: "buff",
                    },
                  },
                  effect: {
                    kind: "add-counter",
                    subject: {
                      kind: "ability-bearer",
                    },
                    counter: "buff",
                    amount: 2,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default enPassant;
