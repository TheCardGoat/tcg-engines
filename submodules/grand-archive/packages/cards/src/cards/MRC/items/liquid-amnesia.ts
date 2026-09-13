import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const liquidAmnesia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k0hliqs2hi",
  slug: "liquid-amnesia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k0hliqs2hi:face:default",
      catalogId: "k0hliqs2hi",
      name: "Liquid Amnesia",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Brew — One Blightroot\n\n[Class Bonus] At the beginning of your recollection phase, put an age counter on Liquid Amnesia.\n\nSacrifice Liquid Amnesia: For every three age counters that were on Liquid Amnesia, banish a card at random from target player’s memory.",
      abilities: [
        {
          id: "k0hliqs2hi-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Blightroot",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Blightroot",
                count: 1,
              },
            ],
          },
        },
        {
          id: "k0hliqs2hi-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, put an age counter on Liquid Amnesia.",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "age",
            },
            amount: 1,
          },
        },
        {
          id: "k0hliqs2hi-a3",
          kind: "activated",
          text: "Sacrifice Liquid Amnesia: For every three age counters that were on Liquid Amnesia, banish a card at random from target player’s memory.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-player",
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
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "divide",
                operands: [
                  {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "age",
                    },
                    basis: "last-known",
                    missing: "zero",
                  },
                  3,
                ],
                rounding: "down",
              },
            },
          ],
          effect: {
            kind: "banish",
            player: {
              binding: "target-player",
            },
            selection: {
              id: "random-memory-cards",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-player",
              },
              method: "random",
              count: {
                kind: "exactly",
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "age",
                      },
                      basis: "last-known",
                      missing: "zero",
                    },
                    3,
                  ],
                  rounding: "down",
                },
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["memory"],
                relationship: "zone-of",
                player: {
                  binding: "target-player",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default liquidAmnesia;
