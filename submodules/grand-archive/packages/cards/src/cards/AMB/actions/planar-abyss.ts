import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const planarAbyss: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qexcwmx2ug",
  slug: "planar-abyss",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qexcwmx2ug:face:default",
      catalogId: "qexcwmx2ug",
      name: "Planar Abyss",
      cost: {
        kind: "reserve",
        amount: 12,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nAt the beginning of your next recollection phase, destroy all non-champion objects and if your Shifting Currents face South, deal 10 damage to each champion you don't control.  ",
      abilities: [
        {
          id: "qexcwmx2ug-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
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
          id: "qexcwmx2ug-a2",
          kind: "card-resolution",
          text: "At the beginning of your next recollection phase, destroy all non-champion objects and if your Shifting Currents face South, deal 10 damage to each champion you don't control.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "phase-begins",
                phase: "recollection",
                actor: "controller",
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "destroy",
                  subject: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      filter: {
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "player-state",
                    player: "controller",
                    state: {
                      named: "shifting-currents",
                      value: "south",
                    },
                  },
                  then: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "each",
                      collection: {
                        zones: ["field"],
                        player: "each-opponent",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                    amount: 10,
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

export default planarAbyss;
