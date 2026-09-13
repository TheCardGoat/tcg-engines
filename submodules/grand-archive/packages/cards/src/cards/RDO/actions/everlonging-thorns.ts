import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const everlongingThorns: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "C3YucOomEM",
  slug: "everlonging-thorns",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "C3YucOomEM:face:default",
      catalogId: "C3YucOomEM",
      name: "Everlonging Thorns",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Put two debuff counters on target ally. If your Shifting Currents face East or West, put 2+LV debuff counters on it instead.\n\n[Kongming Bonus] If Everlonging Thorns is empowered, put it into its owner's material deck preserved.",
      abilities: [
        {
          id: "C3YucOomEM-a1",
          kind: "card-resolution",
          text: "Put two debuff counters on target ally. If your Shifting Currents face East or West, put 2+LV debuff counters on it instead.",
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
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "debuff",
            amount: {
              kind: "conditional",
              condition: {
                kind: "any",
                conditions: [
                  {
                    kind: "player-state",
                    player: "controller",
                    state: {
                      named: "shifting-currents",
                      value: "East",
                    },
                  },
                  {
                    kind: "player-state",
                    player: "controller",
                    state: {
                      named: "shifting-currents",
                      value: "West",
                    },
                  },
                ],
              },
              then: {
                kind: "calculate",
                operator: "add",
                operands: [
                  2,
                  {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                ],
              },
              else: 2,
            },
          },
        },
        {
          id: "C3YucOomEM-a2",
          kind: "card-resolution",
          text: "[Kongming Bonus] If Everlonging Thorns is empowered, put it into its owner's material deck preserved.",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "empowered",
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "material-deck",
                  },
                },
                {
                  kind: "set-object-state",
                  subject: {
                    kind: "source",
                  },
                  state: "preserved",
                  value: true,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default everlongingThorns;
