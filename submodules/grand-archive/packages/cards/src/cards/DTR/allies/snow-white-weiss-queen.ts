import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const snowWhiteWeissQueen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5u5m8xblmd",
  slug: "snow-white-weiss-queen",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5u5m8xblmd:face:default",
      catalogId: "5u5m8xblmd",
      name: "Snow White, Weiss Queen",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "QUEEN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Level 1+] On Enter: Rest target champion. It doesn't wake up during its controller's next wake up phase.\n\n[Level 1+] If a rested champion you don't control would level up into a champion card, return that card to its owner's material deck instead.",
      abilities: [
        {
          id: "5u5m8xblmd-a1",
          kind: "triggered",
          text: "[Level 1+] On Enter: Rest target champion. It doesn't wake up during its controller's next wake up phase.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rest",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "wake",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                condition: {
                  kind: "all",
                  conditions: [
                    {
                      kind: "phase",
                      phase: "wake-up",
                    },
                    {
                      kind: "turn-player",
                      player: {
                        controllerOf: "target-1",
                      },
                    },
                  ],
                },
                duration: {
                  kind: "until-end-of-next-phase",
                  phase: "wake-up",
                  whose: {
                    controllerOf: "target-1",
                  },
                },
              },
            ],
          },
        },
        {
          id: "5u5m8xblmd-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] If a rested champion you don't control would level up into a champion card, return that card to its owner's material deck instead.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "champion-leveled-up",
                subject: {
                  kind: "event-object",
                  bindAs: "level-up-card",
                },
                previousObject: {
                  kind: "event-object",
                  controller: "opponent",
                  filter: {
                    kind: "object-state",
                    state: "rested",
                  },
                },
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "level-up-card",
                  },
                  destination: {
                    zone: "material-deck",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default snowWhiteWeissQueen;
