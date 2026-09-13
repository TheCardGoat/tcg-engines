import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flamebreakChorus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yky280mtts",
  slug: "flamebreak-chorus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yky280mtts:face:default",
      catalogId: "yky280mtts",
      name: "Flamebreak Chorus",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nTarget ally gets +2 POWER until end of turn. If it's defending, wake it up, and it gets an additional +LV POWER until end of turn.",
      abilities: [
        {
          id: "yky280mtts-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
          id: "yky280mtts-a2",
          kind: "card-resolution",
          text: "Target ally gets +2 POWER until end of turn. If it's defending, wake it up, and it gets an additional +LV POWER until end of turn.",
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
            kind: "sequence",
            effects: [
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
                kind: "conditional",
                condition: {
                  kind: "object-state",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  state: "defending",
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
                        amount: {
                          kind: "property",
                          subject: {
                            kind: "champion",
                            player: "controller",
                          },
                          property: "level",
                          basis: "current",
                        },
                      },
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

export default flamebreakChorus;
