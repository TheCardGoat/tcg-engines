import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flowingOubli: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vcxw3yh2t4",
  slug: "flowing-oubli",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vcxw3yh2t4:face:default",
      catalogId: "vcxw3yh2t4",
      name: "Flowing Oubli",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Level 1+] This card costs 1 less to activate. (Apply this effect only if your champion is level 1 or higher.)\n\nLook at the top two cards of your deck. Banish one of them and put an omen counter on it. Put the other on the bottom of your deck.",
      abilities: [
        {
          id: "vcxw3yh2t4-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] This card costs 1 less to activate. (Apply this effect only if your champion is level 1 or higher.)",
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
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "vcxw3yh2t4-a2",
          kind: "card-resolution",
          text: "Look at the top two cards of your deck. Banish one of them and put an omen counter on it. Put the other on the bottom of your deck.",
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
                    amount: 2,
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
                  id: "banished-omen",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-cards",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "banished-omen",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "banishment",
                      },
                    },
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "bound",
                        binding: "banished-omen",
                      },
                      counter: "omen",
                      amount: 1,
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: "banished-omen",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
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

export default flowingOubli;
