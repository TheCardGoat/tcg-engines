import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const breathsColoratura: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1ybdJi1VN5",
  slug: "breaths-coloratura",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1ybdJi1VN5:face:default",
      catalogId: "1ybdJi1VN5",
      name: "Breath's Coloratura",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "MELODY"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nPut a buff counter on each Human ally you control. Until end of turn, Human allies that enter the field under your control enter with an additional buff counter on them.",
      abilities: [
        {
          id: "1ybdJi1VN5-a1",
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
          id: "1ybdJi1VN5-a2",
          kind: "card-resolution",
          text: "Put a buff counter on each Human ally you control. Until end of turn, Human allies that enter the field under your control enter with an additional buff counter on them.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["HUMAN"],
                        },
                      ],
                    },
                  },
                },
                counter: "buff",
                amount: 1,
              },
              {
                kind: "replacement",
                event: {
                  name: "object-entered-field",
                  subject: {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["HUMAN"],
                        },
                      ],
                    },
                  },
                },
                operation: {
                  kind: "add-object-counters",
                  counters: [
                    {
                      counter: "buff",
                      amount: 1,
                    },
                  ],
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default breathsColoratura;
