import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wujiOfLingeringFate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9cef7aknvn",
  slug: "wuji-of-lingering-fate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9cef7aknvn:face:default",
      catalogId: "9cef7aknvn",
      name: "Wuji of Lingering Fate",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Deal 3 damage to target rested ally you don't control.\n\nWhenever your Shifting Currents change from facing West to East, you may sacrifice Wuji of Lingering Fate. If you do, target player puts the top three cards of their deck into their graveyard.",
      abilities: [
        {
          id: "9cef7aknvn-a1",
          kind: "triggered",
          text: "On Enter: Deal 3 damage to target rested ally you don't control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "rested",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 3,
          },
        },
        {
          id: "9cef7aknvn-a2",
          kind: "triggered",
          text: "Whenever your Shifting Currents change from facing West to East, you may sacrifice Wuji of Lingering Fate. If you do, target player puts the top three cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                from: "west",
                to: "east",
              },
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "mill",
                  player: {
                    binding: "target-player",
                  },
                  amount: 3,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default wujiOfLingeringFate;
