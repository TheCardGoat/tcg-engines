import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const misteyeArcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m6c8xy4cje",
  slug: "misteye-archer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m6c8xy4cje:face:default",
      catalogId: "m6c8xy4cje",
      name: "Misteye Archer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Ranged 2 \n\n(3), REST: Look at the top card of your deck. If it's a water element card, you may put it into your graveyard. If you do, Misteye Archer becomes distant and prevent the next 2 damage that would be dealt to it this turn.",
      abilities: [
        {
          id: "m6c8xy4cje-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
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
          id: "m6c8xy4cje-a2",
          kind: "activated",
          text: "(3), REST: Look at the top card of your deck. If it's a water element card, you may put it into your graveyard. If you do, Misteye Archer becomes distant and prevent the next 2 damage that would be dealt to it this turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "top-card",
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
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "top-card",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "top-card",
                        },
                        from: "main-deck",
                        destination: {
                          zone: "graveyard",
                        },
                      },
                      {
                        kind: "set-object-state",
                        subject: {
                          kind: "source",
                        },
                        state: "distant",
                        value: true,
                      },
                      {
                        kind: "replacement",
                        event: {
                          name: "damage-dealt",
                          recipient: {
                            kind: "source",
                          },
                        },
                        operation: {
                          kind: "prevent",
                        },
                        capacity: {
                          amount: 2,
                          scope: "replacement-instance",
                        },
                        duration: {
                          kind: "this-turn",
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default misteyeArcher;
