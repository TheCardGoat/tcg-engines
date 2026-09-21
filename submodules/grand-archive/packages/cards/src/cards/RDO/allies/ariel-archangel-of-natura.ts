import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arielArchangelOfNatura: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FQKVzsMp3B",
  slug: "ariel-archangel-of-natura",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FQKVzsMp3B:face:default",
      catalogId: "FQKVzsMp3B",
      name: "Ariel, Archangel of Natura",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Crux & Tera Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are crux and/or tera element, this card becomes imbued.)\n\nOn Enter: If Ariel is imbued, reveal the top card of your deck and put it into your material deck preserved. Then you may banish a card from your material deck. If you do, Ariel gets +3POWER until end of turn.",
      abilities: [
        {
          id: "FQKVzsMp3B-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Crux & Tera Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are crux and/or tera element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: {
              oneOf: ["CRUX", "TERA"],
            },
          },
        },
        {
          id: "FQKVzsMp3B-a2",
          kind: "triggered",
          text: "On Enter: If Ariel is imbued, reveal the top card of your deck and put it into your material deck preserved. Then you may banish a card from your material deck. If you do, Ariel gets +3POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
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
                      kind: "reveal",
                      player: "controller",
                      selection: {
                        id: "revealed-top-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "exactly",
                          amount: 1,
                        },
                        candidates: {
                          kind: "card",
                          zones: ["main-deck"],
                          relationship: "zone-of",
                          player: "controller",
                          fromTop: true,
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "revealed-top-card",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "material-deck",
                      },
                    },
                    {
                      kind: "set-object-state",
                      subject: {
                        kind: "bound",
                        binding: "revealed-top-card",
                      },
                      state: "preserved",
                      value: true,
                    },
                  ],
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "attempt",
                      effect: {
                        kind: "banish",
                        player: "controller",
                        selection: {
                          id: "banished-cards",
                          kind: "choice",
                          declared: "resolution",
                          chooser: "controller",
                          count: {
                            kind: "exactly",
                            amount: 1,
                          },
                          candidates: {
                            kind: "card",
                            zones: ["material-deck"],
                            relationship: "zone-of",
                            player: "controller",
                          },
                        },
                      },
                      bindSucceededAs: "optional-action-succeeded",
                    },
                    {
                      kind: "conditional",
                      condition: {
                        kind: "effect-succeeded",
                        binding: "optional-action-succeeded",
                      },
                      then: {
                        kind: "continuous",
                        subjects: {
                          kind: "source",
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
                          amount: 3,
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

export default arielArchangelOfNatura;
