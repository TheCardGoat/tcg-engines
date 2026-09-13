import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lorraineBlademaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TJTeWcZnsQ",
  slug: "lorraine-blademaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TJTeWcZnsQ:face:default",
      catalogId: "TJTeWcZnsQ",
      name: "Lorraine, Blademaster",
      lineageName: "Lorraine",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 24,
      },
      rulesText:
        'Lorraine Lineage (Lorraine, Blademaster must be leveled from a previous level "Lorraine" champion.)\n\nOn Enter: Until end of turn, Lorraine\'s attacks get +2 POWER and gain "On Kill: Draw a card."',
      abilities: [
        {
          id: "TJTeWcZnsQ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Lorraine Lineage (Lorraine, Blademaster must be leveled from a previous level "Lorraine" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Lorraine",
          },
        },
        {
          id: "TJTeWcZnsQ-a2",
          kind: "triggered",
          text: 'On Enter: Until end of turn, Lorraine\'s attacks get +2 POWER and gain "On Kill: Draw a card."',
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
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "attacks-by",
                  attacker: {
                    kind: "source",
                  },
                },
                affectedSet: "dynamic",
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
                  amount: 2,
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "attacks-by",
                  attacker: {
                    kind: "source",
                  },
                },
                affectedSet: "dynamic",
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
                    id: "granted-18tnu0j-a1",
                    kind: "triggered",
                    text: "On Kill: Draw a card.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "object-killed",
                        subject: {
                          kind: "source",
                        },
                      },
                    },
                    effect: {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
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

export default lorraineBlademaster;
