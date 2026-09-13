import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const awakenedFrostguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mnu1xhs5jw",
  slug: "awakened-frostguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mnu1xhs5jw:face:default",
      catalogId: "mnu1xhs5jw",
      name: "Awakened Frostguard",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Foster\n\nOn Foster: You may banish up to two cards with floating memory from your graveyard. For each card banished this way, put a buff counter on Awakened Frostguard and draw a card. \n\nAwakened Frostguard has vigor as long as it's fostered.",
      abilities: [
        {
          id: "mnu1xhs5jw-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Foster",
          keyword: {
            name: "foster",
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
        },
        {
          id: "mnu1xhs5jw-a2",
          kind: "triggered",
          text: "On Foster: You may banish up to two cards with floating memory from your graveyard. For each card banished this way, put a buff counter on Awakened Frostguard and draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-fostered",
              subject: {
                kind: "source",
              },
            },
          },
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
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "has-keyword",
                        keyword: "floating-memory",
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
                    kind: "sequence",
                    effects: [
                      {
                        kind: "add-counter",
                        subject: {
                          kind: "source",
                        },
                        counter: "buff",
                        amount: 1,
                      },
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          id: "mnu1xhs5jw-a3",
          kind: "static",
          staticKind: "effects",
          text: "Awakened Frostguard has vigor as long as it's fostered.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "fostered",
              },
              duration: {
                kind: "while-source-in-functional-zone",
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
          ],
        },
      ],
    },
  },
};

export default awakenedFrostguard;
