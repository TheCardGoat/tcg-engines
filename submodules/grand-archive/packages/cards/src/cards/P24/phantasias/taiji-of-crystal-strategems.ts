import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const taijiOfCrystalStrategems: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l17uc67eaq",
  slug: "taiji-of-crystal-strategems",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l17uc67eaq:face:default",
      catalogId: "l17uc67eaq",
      name: "Taiji of Crystal Strategems",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Whenever your Shifting Currents change from facing South to East while Taiji of Crystal Strategems is awake, you may rest it. When you do, as a Spell, deal 3 damage to target champion you don't control.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
      abilities: [
        {
          id: "l17uc67eaq-a1",
          kind: "triggered",
          text: "Whenever your Shifting Currents change from facing South to East while Taiji of Crystal Strategems is awake, you may rest it. When you do, as a Spell, deal 3 damage to target champion you don't control.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                from: "south",
                to: "east",
              },
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "awake",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              consequence: {
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
                  amount: 3,
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
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "l17uc67eaq-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default taijiOfCrystalStrategems;
