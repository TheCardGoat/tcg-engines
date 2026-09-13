import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shizunOfTheAsh: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pnDUy9jUbo",
  slug: "shizun-of-the-ash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pnDUy9jUbo:face:default",
      catalogId: "pnDUy9jUbo",
      name: "Shizun of the Ash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Enter: You may discard a card. If you do, draw a card. \n\n[Kongming Bonus] REST, Banish a fire element card from your graveyard: As a Spell, deal 4 damage to target ally. Activate this ability only if your Shifting Currents face North or South. ",
      abilities: [
        {
          id: "pnDUy9jUbo-a1",
          kind: "triggered",
          text: "On Enter: You may discard a card. If you do, draw a card.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
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
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              ],
            },
          },
        },
        {
          id: "pnDUy9jUbo-a2",
          kind: "activated",
          text: "[Kongming Bonus] REST, Banish a fire element card from your graveyard: As a Spell, deal 4 damage to target ally. Activate this ability only if your Shifting Currents face North or South.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
            ],
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          condition: {
            kind: "any",
            conditions: [
              {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "North",
                },
              },
              {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "South",
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 4,
            },
          },
        },
      ],
    },
  },
};

export default shizunOfTheAsh;
