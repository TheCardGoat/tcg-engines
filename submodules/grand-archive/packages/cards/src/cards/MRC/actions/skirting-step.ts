import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const skirtingStep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "brq9x9z2k2",
  slug: "skirting-step",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "brq9x9z2k2:face:default",
      catalogId: "brq9x9z2k2",
      name: "Skirting Step",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)\n\nTarget unit becomes distant. If Skirting Step is imbued, prevent the next 1 damage that would be dealt to that unit this turn and draw a card.",
      abilities: [
        {
          id: "brq9x9z2k2-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "brq9x9z2k2-a2",
          kind: "card-resolution",
          text: "Target unit becomes distant. If Skirting Step is imbued, prevent the next 1 damage that would be dealt to that unit this turn and draw a card.",
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
                  kind: "activation-state",
                  state: "imbued",
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "replacement",
                      event: {
                        name: "damage-dealt",
                        recipient: {
                          kind: "bound-object",
                          binding: "target-1",
                        },
                      },
                      operation: {
                        kind: "prevent",
                      },
                      capacity: {
                        amount: 1,
                        scope: "replacement-instance",
                      },
                      duration: {
                        kind: "this-turn",
                      },
                    },
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
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

export default skirtingStep;
