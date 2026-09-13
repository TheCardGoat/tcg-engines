import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mechanicalHare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j3q2svdv3z",
  slug: "mechanical-hare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j3q2svdv3z:face:default",
      catalogId: "j3q2svdv3z",
      name: "Mechanical Hare",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "AUTOMATON", "ANIMAL", "RABBIT"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        '[Class Bonus] On Enter: Put a buff counter on Mechanical Hare.\n\nAs long as Mechanical Hare has two or more buff counters on it, it has “On Attack: Banish up to two target cards in a single graveyard."',
      abilities: [
        {
          id: "j3q2svdv3z-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put a buff counter on Mechanical Hare.",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "j3q2svdv3z-a2",
          kind: "static",
          staticKind: "effects",
          text: 'As long as Mechanical Hare has two or more buff counters on it, it has “On Attack: Banish up to two target cards in a single graveyard."',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: "buff",
                  },
                  operator: "gte",
                  right: 2,
                },
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
                  id: "granted-6id1kq-a1",
                  kind: "triggered",
                  text: "On Attack: Banish up to two target cards in a single graveyard.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-declared",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "up-to",
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                    },
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

export default mechanicalHare;
