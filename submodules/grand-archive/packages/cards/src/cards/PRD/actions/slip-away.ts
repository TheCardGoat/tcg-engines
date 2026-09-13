import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slipAway: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ooffy4dwav",
  slug: "slip-away",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ooffy4dwav:face:default",
      catalogId: "ooffy4dwav",
      name: "Slip Away",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are umbra element, this card becomes imbued.)\n\nTarget unit becomes distant. If Slip Away is imbued, that unit also gains stealth and spellshroud until end of turn.",
      abilities: [
        {
          id: "ooffy4dwav-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are umbra element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "ooffy4dwav-a2",
          kind: "card-resolution",
          text: "Target unit becomes distant. If Slip Away is imbued, that unit also gains stealth and spellshroud until end of turn.",
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
                        layer: "D",
                        modifies: "ability",
                      },
                      change: {
                        kind: "grant-keyword",
                        keyword: {
                          name: "stealth",
                        },
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
                        layer: "D",
                        modifies: "ability",
                      },
                      change: {
                        kind: "grant-keyword",
                        keyword: {
                          name: "spellshroud",
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

export default slipAway;
