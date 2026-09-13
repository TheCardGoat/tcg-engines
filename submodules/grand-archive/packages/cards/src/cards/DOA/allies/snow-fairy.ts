import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const snowFairy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4s0c9XgLg7",
  slug: "snow-fairy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4s0c9XgLg7:face:default",
      catalogId: "4s0c9XgLg7",
      name: "Snow Fairy",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FAIRY"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nOn Enter: Rest target ally you don't control. That ally doesn't wake up during its controller's wake up phase as long as you control Snow Fairy.",
      abilities: [
        {
          id: "4s0c9XgLg7-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "4s0c9XgLg7-a2",
          kind: "triggered",
          text: "On Enter: Rest target ally you don't control. That ally doesn't wake up during its controller's wake up phase as long as you control Snow Fairy.",
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
                relationship: "controlled-by",
                player: "opponent",
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
                    {
                      kind: "controls-subject",
                      player: "controller",
                      subject: {
                        kind: "source",
                      },
                    },
                  ],
                },
                duration: {
                  kind: "while-source-on-field",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default snowFairy;
