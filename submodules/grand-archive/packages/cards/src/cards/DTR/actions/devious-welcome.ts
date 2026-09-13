import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deviousWelcome: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vz4kc558yx",
  slug: "devious-welcome",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vz4kc558yx:face:default",
      catalogId: "vz4kc558yx",
      name: "Devious Welcome",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent's recollection phase.\n\nEach player draws a card. Then you choose action or ally. At the beginning of the next end phase, if the turn player did not activate a card with the chosen type this turn, that player discards a card at random from their hand and memory.",
      abilities: [
        {
          id: "vz4kc558yx-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's recollection phase.",
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
                    phase: "recollection",
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
          id: "vz4kc558yx-a2",
          kind: "card-resolution",
          text: "Each player draws a card. Then you choose action or ally. At the beginning of the next end phase, if the turn player did not activate a card with the chosen type this turn, that player discards a card at random from their hand and memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "each-player",
                amount: 1,
              },
              {
                kind: "choose-value",
                selection: {
                  id: "chosen-type",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "option",
                    options: ["ACTION", "ALLY"],
                  },
                },
                trackAs: "chosen-type",
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "end",
                  },
                },
                limit: 1,
                expires: {
                  kind: "until-end-of-next-phase",
                  phase: "end",
                },
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "not",
                    condition: {
                      kind: "history",
                      event: "card-activated",
                      window: "this-turn",
                      actor: "turn-player",
                      filter: {
                        kind: "matches-tracked-characteristic",
                        key: "chosen-type",
                        characteristic: "type",
                      },
                      minimum: 1,
                    },
                  },
                  then: {
                    kind: "discard",
                    player: "turn-player",
                    selection: {
                      id: "random-discard",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "turn-player",
                      method: "random",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      unique: true,
                      candidates: {
                        kind: "union",
                        sources: [
                          {
                            kind: "card",
                            zones: ["hand"],
                            relationship: "zone-of",
                            player: "turn-player",
                          },
                          {
                            kind: "card",
                            zones: ["memory"],
                            relationship: "zone-of",
                            player: "turn-player",
                          },
                        ],
                      },
                    },
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

export default deviousWelcome;
