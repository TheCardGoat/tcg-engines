import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const waitedAccord: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xF9phlSAkE",
  slug: "waited-accord",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xF9phlSAkE:face:default",
      catalogId: "xF9phlSAkE",
      name: "Waited Accord",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        'On Enter: You may reveal three advanced element cards from your material deck. If you do, Waited Accord gains "The first advanced element card each player activates each turn costs 2 more to activate." \n\n[Level 2+] Sacrifice Waited Accord: Draw a card.',
      abilities: [
        {
          id: "xF9phlSAkE-a1",
          kind: "triggered",
          text: 'On Enter: You may reveal three advanced element cards from your material deck. If you do, Waited Accord gains "The first advanced element card each player activates each turn costs 2 more to activate."',
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "reveal-selection",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 3,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["material-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element-category",
                          value: "advanced",
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
                    kind: "continuous",
                    subjects: {
                      kind: "source",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "permanent",
                    },
                    layer: {
                      layer: "D",
                      modifies: "ability",
                    },
                    change: {
                      kind: "grant-ability",
                      ability: {
                        id: "granted-jgj7xp-a1",
                        kind: "static",
                        staticKind: "effects",
                        text: "The first advanced element card each player activates each turn costs 2 more to activate.",
                        effects: [
                          {
                            kind: "rule-modification",
                            mode: "modify-cost",
                            action: "activate",
                            subject: {
                              kind: "player",
                              player: "each-player",
                            },
                            filter: {
                              kind: "element-category",
                              value: "advanced",
                            },
                            occurrence: {
                              count: 1,
                              window: "this-turn",
                              actorScope: "same-player",
                            },
                            costKind: "reserve",
                            costOperation: "add",
                            amount: 2,
                            duration: {
                              kind: "while-source-in-functional-zone",
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "xF9phlSAkE-a2",
          kind: "activated",
          text: "[Level 2+] Sacrifice Waited Accord: Draw a card.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
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
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default waitedAccord;
