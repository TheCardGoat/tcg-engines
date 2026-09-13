import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ignitionDraw: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RhSPMn8Lix",
  slug: "ignition-draw",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RhSPMn8Lix:face:default",
      catalogId: "RhSPMn8Lix",
      name: "Ignition Draw",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "As long as your champion is distant, this card costs 2 less to activate.\n\nLook at the top six cards of your deck. Banish up to two Aethercharge cards from among them and put the rest on the bottom of your deck in any order. Until end of turn, you may activate the banished cards.",
      abilities: [
        {
          id: "RhSPMn8Lix-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your champion is distant, this card costs 2 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "RhSPMn8Lix-a2",
          kind: "card-resolution",
          text: "Look at the top six cards of your deck. Banish up to two Aethercharge cards from among them and put the rest on the bottom of your deck in any order. Until end of turn, you may activate the banished cards.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 6,
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
                kind: "choose",
                selection: {
                  id: "banished-aethercharge",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-cards",
                    filter: {
                      kind: "subtype",
                      oneOf: ["AETHERCHARGE"],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "banished-aethercharge",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "banishment",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: "banished-aethercharge",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: "controller",
                        },
                      },
                    },
                    {
                      kind: "rule-modification",
                      mode: "allow",
                      action: "activate",
                      subject: {
                        kind: "bound",
                        binding: "banished-aethercharge",
                      },
                      fromZone: "banishment",
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
      ],
    },
  },
};

export default ignitionDraw;
