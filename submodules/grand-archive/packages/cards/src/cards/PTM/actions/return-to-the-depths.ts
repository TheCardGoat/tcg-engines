import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const returnToTheDepths: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fNlJ0MaxiI",
  slug: "return-to-the-depths",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fNlJ0MaxiI:face:default",
      catalogId: "fNlJ0MaxiI",
      name: "Return to the Depths",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time damage would be dealt to your champion this turn, prevent all but 1 of that damage.\n\n[Ciel Bonus] When 3 or more damage is prevented this way, you may banish a card from your graveyard and put an omen counter on it.",
      abilities: [
        {
          id: "fNlJ0MaxiI-a1",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent all but 1 of that damage.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
              amount: {
                kind: "calculate",
                operator: "subtract",
                operands: [
                  {
                    kind: "event-amount",
                  },
                  1,
                ],
              },
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "fNlJ0MaxiI-a2",
          kind: "card-resolution",
          text: "[Ciel Bonus] When 3 or more damage is prevented this way, you may banish a card from your graveyard and put an omen counter on it.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "modified-ability-result-amount",
                  metric: "damage-prevented",
                },
                operator: "gte",
                right: 3,
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
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "new-omen",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                    },
                    bindResultAs: "new-omen",
                  },
                  {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "new-omen",
                    },
                    counter: "omen",
                    amount: 1,
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default returnToTheDepths;
