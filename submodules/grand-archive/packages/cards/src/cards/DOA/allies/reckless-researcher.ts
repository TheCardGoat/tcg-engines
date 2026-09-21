import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const recklessResearcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dY36bObi9p",
  slug: "reckless-researcher",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dY36bObi9p:face:default",
      catalogId: "dY36bObi9p",
      name: "Reckless Researcher",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: You may banish a fire element card from your graveyard. If you do, choose a unit and deal 2 damage to it. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "dY36bObi9p-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish a fire element card from your graveyard. If you do, choose a unit and deal 2 damage to it. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
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
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
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
                    kind: "choose",
                    selection: {
                      id: "target-1",
                      kind: "choice",
                      declared: "resolution",
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
                    effect: {
                      kind: "deal-damage",
                      source: {
                        kind: "source",
                      },
                      recipient: {
                        kind: "bound",
                        binding: "target-1",
                      },
                      amount: 2,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default recklessResearcher;
