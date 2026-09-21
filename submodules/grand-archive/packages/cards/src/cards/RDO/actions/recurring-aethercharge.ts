import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const recurringAethercharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MG8QoeZBXY",
  slug: "recurring-aethercharge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MG8QoeZBXY:face:default",
      catalogId: "MG8QoeZBXY",
      name: "Recurring Aethercharge",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "You may load Recurring Aethercharge into an Aetherwing weapon you control. \n\n[Class Bonus] (3): Load this card from your graveyard into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "MG8QoeZBXY-a1",
          kind: "card-resolution",
          text: "You may load Recurring Aethercharge into an Aetherwing weapon you control.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "chosen-weapon",
                kind: "choice",
                declared: "resolution",
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
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["AETHERWING"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "loaded",
                  host: {
                    kind: "bound",
                    binding: "chosen-weapon",
                  },
                },
              },
            },
          },
        },
        {
          id: "MG8QoeZBXY-a2",
          kind: "activated",
          text: "[Class Bonus] (3): Load this card from your graveyard into an Aetherwing weapon you control.",
          activation: "ability",
          functionalZones: ["graveyard"],
          cost: {
            kind: "pay-reserve",
            amount: 3,
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
            kind: "choose",
            selection: {
              id: "chosen-aetherwing-weapon",
              kind: "choice",
              declared: "resolution",
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
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AETHERWING"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "source",
              },
              from: "graveyard",
              destination: {
                zone: "loaded",
                host: {
                  kind: "bound",
                  binding: "chosen-aetherwing-weapon",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default recurringAethercharge;
