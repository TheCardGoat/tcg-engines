import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flameblessedTrainee: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qmyn2rz308",
  slug: "flameblessed-trainee",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qmyn2rz308:face:default",
      catalogId: "qmyn2rz308",
      name: "Flameblessed Trainee",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: If Flameblessed Trainee is attacking an ally, you may discard a fire element card. If you do, this attack gets +3 POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "qmyn2rz308-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: If Flameblessed Trainee is attacking an ally, you may discard a fire element card. If you do, this attack gets +3 POWER. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "combat-relation",
                    relation: "attacking",
                    subject: {
                      kind: "source",
                    },
                    otherFilter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                  then: {
                    kind: "optional",
                    player: "controller",
                    allOrNothing: true,
                    effect: {
                      kind: "discard",
                      player: "controller",
                      selection: {
                        id: "discarded-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "exactly",
                          amount: 1,
                        },
                        candidates: {
                          kind: "card",
                          zones: ["hand"],
                          relationship: "zone-of",
                          player: "controller",
                          filter: {
                            kind: "element",
                            oneOf: ["FIRE"],
                          },
                        },
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
              },
            ],
          },
        },
      ],
    },
  },
};

export default flameblessedTrainee;
