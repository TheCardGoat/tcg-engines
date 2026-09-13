import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimeCalling: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dc8P58gmjR",
  slug: "slime-calling",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dc8P58gmjR:face:default",
      catalogId: "dc8P58gmjR",
      name: "Slime Calling",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SLIME", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent's end phase.\n\n[Class Bonus] Look at the top 3+LV cards of your deck. You may activate up to two Slime ally cards from among them. Cards you activate this way cost 1 less to activate. Put the rest of the cards on the bottom of your deck in any order.",
      abilities: [
        {
          id: "dc8P58gmjR-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's end phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "end",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "dc8P58gmjR-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Look at the top 3+LV cards of your deck. You may activate up to two Slime ally cards from among them. Cards you activate this way cost 1 less to activate. Put the rest of the cards on the bottom of your deck in any order.",
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
                    amount: {
                      kind: "calculate",
                      operator: "add",
                      operands: [
                        3,
                        {
                          kind: "property",
                          subject: {
                            kind: "champion",
                            player: "controller",
                          },
                          property: "level",
                          basis: "current",
                        },
                      ],
                    },
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
                  id: "activated-cards",
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
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SLIME"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "for-each",
                      collection: {
                        binding: "activated-cards",
                      },
                      bindEachAs: "activated-card",
                      effect: {
                        kind: "activate-card",
                        subject: {
                          kind: "bound",
                          binding: "activated-card",
                        },
                        payCosts: true,
                        costModifiers: [
                          {
                            operation: "subtract",
                            amount: 1,
                          },
                        ],
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: "activated-cards",
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

export default slimeCalling;
