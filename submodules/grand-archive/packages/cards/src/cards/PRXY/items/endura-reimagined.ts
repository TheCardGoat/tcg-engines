import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enduraReimagined: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "X7rh3Yi26A",
  slug: "endura-reimagined",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "X7rh3Yi26A:face:default",
      catalogId: "X7rh3Yi26A",
      name: "Endura, Reimagined",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SCEPTER"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Rai Bonus] On Enter: You may banish a card named Endura, Scepter of Ignition from your material deck. If you do, put two enlighten counters on your champion.\n\n[Rai Bonus] Remove three enlighten counters from your champion,  REST: As a Spell, deal 2 damage to up to one target unit. Draw a card.",
      abilities: [
        {
          id: "X7rh3Yi26A-a1",
          kind: "triggered",
          text: "[Rai Bonus] On Enter: You may banish a card named Endura, Scepter of Ignition from your material deck. If you do, put two enlighten counters on your champion.",
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
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Rai",
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
                  kind: "attempt",
                  effect: {
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
                          kind: "name",
                          value: "Endura, Scepter of Ignition",
                          match: "exact",
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "add-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "enlighten",
                    amount: 2,
                  },
                },
              ],
            },
          },
        },
        {
          id: "X7rh3Yi26A-a2",
          kind: "activated",
          text: "[Rai Bonus] Remove three enlighten counters from your champion,  REST: As a Spell, deal 2 damage to up to one target unit. Draw a card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "enlighten",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
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
                kind: "up-to",
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
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Rai",
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  amount: 2,
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
      ],
    },
  },
};

export default enduraReimagined;
