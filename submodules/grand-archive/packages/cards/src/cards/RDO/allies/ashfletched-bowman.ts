import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ashfletchedBowman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vUq1XBaQtU",
  slug: "ashfletched-bowman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vUq1XBaQtU:face:default",
      catalogId: "vUq1XBaQtU",
      name: "Ashfletched Bowman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 3\n\n[Class Bonus] At the beginning of your recollection phase, banish up to three fire element cards from your graveyard. For each card banished this way,  Ashfletched Bowman gains ranged 3 until end of turn. (Multiple instances of ranged stack.)",
      abilities: [
        {
          id: "vUq1XBaQtU-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 3",
          keyword: {
            name: "ranged",
            value: 3,
          },
        },
        {
          id: "vUq1XBaQtU-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, banish up to three fire element cards from your graveyard. For each card banished this way,  Ashfletched Bowman gains ranged 3 until end of turn. (Multiple instances of ranged stack.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 3,
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
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "ranged",
                      value: 3,
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

export default ashfletchedBowman;
