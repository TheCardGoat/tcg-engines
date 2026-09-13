import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const inspiringAethercharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fPtTKILV7f",
  slug: "inspiring-aethercharge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fPtTKILV7f:face:default",
      catalogId: "fPtTKILV7f",
      name: "Inspiring Aethercharge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {
        power: 1,
      },
      rulesText:
        "Allies you control get +1POWER until end of turn.\n\nYou may load Inspiring Aethercharge into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "fPtTKILV7f-a1",
          kind: "card-resolution",
          text: "Allies you control get +1POWER until end of turn.",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
        {
          id: "fPtTKILV7f-a2",
          kind: "card-resolution",
          text: "You may load Inspiring Aethercharge into an Aetherwing weapon you control.",
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
      ],
    },
  },
};

export default inspiringAethercharge;
