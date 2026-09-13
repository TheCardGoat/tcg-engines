import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const merlinBrilliantVestige: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2TCyILvBYa",
  slug: "merlin-brilliant-vestige",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2TCyILvBYa:face:default",
      catalogId: "2TCyILvBYa",
      name: "Merlin, Brilliant Vestige",
      lineageName: "Merlin",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["CRUX"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Merlin Lineage\n\n[Sheen 8+] On Enter: You may banish a regalia card from your material deck. If you do, draw a card and put a preparation counter on your champion.\n\n[Sheen 24+] At the beginning of your end phase, look at target opponent's memory and banish a card from it. Until the end of that opponent's next turn, they may activate that card.",
      abilities: [
        {
          id: "2TCyILvBYa-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Merlin Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Merlin",
          },
        },
        {
          id: "2TCyILvBYa-a2",
          kind: "triggered",
          text: "[Sheen 8+] On Enter: You may banish a regalia card from your material deck. If you do, draw a card and put a preparation counter on your champion.",
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
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 8,
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
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["material-deck"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "supertype",
                        oneOf: ["REGALIA"],
                      },
                    },
                  },
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: "preparation",
                      amount: 1,
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          id: "2TCyILvBYa-a3",
          kind: "triggered",
          text: "[Sheen 24+] At the beginning of your end phase, look at target opponent's memory and banish a card from it. Until the end of that opponent's next turn, they may activate that card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
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
                minimum: 24,
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "looked-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "banish",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "banished-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-memory",
                  },
                },
                bindResultAs: "banished-card",
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "activate",
                subject: {
                  kind: "bound",
                  binding: "banished-card",
                },
                fromZone: "banishment",
                condition: {
                  kind: "player-relation",
                  player: {
                    binding: "target-opponent",
                  },
                  relation: "controller",
                },
                duration: {
                  kind: "until-end-of-turn",
                  whose: {
                    binding: "target-opponent",
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

export default merlinBrilliantVestige;
