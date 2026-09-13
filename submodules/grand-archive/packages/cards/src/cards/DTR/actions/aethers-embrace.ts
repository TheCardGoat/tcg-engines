import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aethersEmbrace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wd7nuab7f3",
  slug: "aethers-embrace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wd7nuab7f3:face:default",
      catalogId: "wd7nuab7f3",
      name: "Aether's Embrace",
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
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Target unit becomes distant. If that unit is a defending Ranger ally, wake it up and it gets +2POWER and +2LIFE until end of turn.\n\nYou may load Aether's Embrace into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "wd7nuab7f3-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant. If that unit is a defending Ranger ally, wake it up and it gets +2POWER and +2LIFE until end of turn.",
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
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "all",
                  conditions: [
                    {
                      kind: "object-state",
                      subject: {
                        kind: "bound",
                        binding: "target-1",
                      },
                      state: "defending",
                    },
                    {
                      kind: "subject-matches",
                      subject: {
                        kind: "bound",
                        binding: "target-1",
                      },
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["RANGER"],
                          },
                        ],
                      },
                    },
                  ],
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "wake",
                      subject: {
                        kind: "bound",
                        binding: "target-1",
                      },
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "bound",
                        binding: "target-1",
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
                        amount: 2,
                      },
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "bound",
                        binding: "target-1",
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
                        property: "life",
                        operation: "add",
                        amount: 2,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: "wd7nuab7f3-a2",
          kind: "card-resolution",
          text: "You may load Aether's Embrace into an Aetherwing weapon you control.",
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

export default aethersEmbrace;
