import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dissuadingAether: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bx25s7kiln",
  slug: "dissuading-aether",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bx25s7kiln:face:default",
      catalogId: "bx25s7kiln",
      name: "Dissuading Aether",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Target unit's attacks get -3POWER until end of turn. Then you may load Dissuading Aether into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "bx25s7kiln-a1",
          kind: "card-resolution",
          text: "Target unit's attacks get -3POWER until end of turn. Then you may load Dissuading Aether into an Aetherwing weapon you control.",
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
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-declared",
                    subject: {
                      kind: "bound-object",
                      binding: "target-1",
                    },
                  },
                },
                expires: {
                  kind: "this-turn",
                },
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "subtract",
                    amount: 3,
                  },
                },
              },
              {
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
            ],
          },
        },
      ],
    },
  },
};

export default dissuadingAether;
