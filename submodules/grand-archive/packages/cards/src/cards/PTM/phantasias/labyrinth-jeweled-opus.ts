import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const labyrinthJeweledOpus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "A58xZJJMz6",
  slug: "labyrinth-jeweled-opus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "A58xZJJMz6:face:default",
      catalogId: "A58xZJJMz6",
      name: "Labyrinth, Jeweled Opus",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["EXALTED", "WATER"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 3 less to activate.\n\n[Sheen 10+] Your champion has spellshroud and stealth as long as they're awake and an opponent with the most cards in their memory has six or less cards in their memory.\n\n[Sheen 18+] At the beginning of your end phase, draw a card.\n\n[Sheen 36+] REST: Move any amount of sheen counters from your Fractured Memories to target unit.",
      abilities: [
        {
          id: "A58xZJJMz6-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 3 less to activate.",
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
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "A58xZJJMz6-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Sheen 10+] Your champion has spellshroud and stealth as long as they're awake and an opponent with the most cards in their memory has six or less cards in their memory.",
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 10,
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "object-state",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    state: "awake",
                  },
                  {
                    kind: "player-zone-count",
                    players: "each-opponent",
                    quantifier: "all",
                    zone: "memory",
                    operator: "lte",
                    value: 6,
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
                kind: "grant-keyword",
                keyword: {
                  name: "spellshroud",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "object-state",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    state: "awake",
                  },
                  {
                    kind: "player-zone-count",
                    players: "each-opponent",
                    quantifier: "all",
                    zone: "memory",
                    operator: "lte",
                    value: 6,
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
                kind: "grant-keyword",
                keyword: {
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "A58xZJJMz6-a3",
          kind: "triggered",
          text: "[Sheen 18+] At the beginning of your end phase, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 18,
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "A58xZJJMz6-a4",
          kind: "activated",
          text: "[Sheen 36+] REST: Move any amount of sheen counters from your Fractured Memories to target unit.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 36,
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "moved-sheen-count",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "number",
                    minimum: 0,
                    maximum: {
                      kind: "counter-count",
                      subject: {
                        kind: "mastery",
                        player: "controller",
                        name: "Fractured Memories",
                      },
                      counter: {
                        named: "sheen",
                      },
                    },
                  },
                },
                trackAs: "moved-sheen-count",
              },
              {
                kind: "move-counter",
                from: {
                  kind: "mastery",
                  player: "controller",
                  name: "Fractured Memories",
                },
                to: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: {
                  named: "sheen",
                },
                amount: {
                  kind: "binding",
                  binding: "moved-sheen-count",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default labyrinthJeweledOpus;
