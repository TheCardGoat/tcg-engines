import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fierySwing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ijkyboiopv",
  slug: "fiery-swing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ijkyboiopv:face:default",
      catalogId: "ijkyboiopv",
      name: "Fiery Swing",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "POLEARM"],
      },
      elements: ["FIRE"],
      stats: {
        power: 6,
      },
      rulesText:
        "[Class Bonus] On Attack: You may banish up to six fire element cards from your graveyard. For each card banished this way, Fiery Swing gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "ijkyboiopv-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish up to six fire element cards from your graveyard. For each card banished this way, Fiery Swing gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 6,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    },
                  },
                },
                {
                  kind: "for-each",
                  collection: {
                    binding: "banished-cards",
                  },
                  bindEachAs: "that-card",
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "permanent",
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
              ],
            },
          },
        },
      ],
    },
  },
};

export default fierySwing;
