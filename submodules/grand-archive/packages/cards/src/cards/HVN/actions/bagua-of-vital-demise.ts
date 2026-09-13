import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const baguaOfVitalDemise: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "imdj3c7oh0",
  slug: "bagua-of-vital-demise",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "imdj3c7oh0:face:default",
      catalogId: "imdj3c7oh0",
      name: "Bagua of Vital Demise",
      cost: {
        kind: "reserve",
        amount: 2,
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
        "As long as your Shifting Currents face West, you may activate this card from your material deck.\n\nDeal 4 damage to target unit. If your Shifting Currents face East, put this card into its owner's material deck preserved.\n",
      abilities: [
        {
          id: "imdj3c7oh0-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your Shifting Currents face West, you may activate this card from your material deck.",
          functionalZones: ["material-deck"],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              condition: {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "West",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "imdj3c7oh0-a2",
          kind: "card-resolution",
          text: "Deal 4 damage to target unit. If your Shifting Currents face East, put this card into its owner's material deck preserved.",
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
                amount: 4,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "East",
                  },
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
            ],
          },
        },
      ],
    },
  },
};

export default baguaOfVitalDemise;
