import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rousingSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kEZ2aOZKji",
  slug: "rousing-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kEZ2aOZKji:face:default",
      catalogId: "kEZ2aOZKji",
      name: "Rousing Slime",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: You may rest Rousing Slime. If you do, wake up another Slime ally you control. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "kEZ2aOZKji-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may rest Rousing Slime. If you do, wake up another Slime ally you control. (Apply this effect only if your champion’s class matches this card’s class.)",
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
                    kind: "rest",
                    subject: {
                      kind: "source",
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
                      id: "woken-object",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        relationship: "controlled-by",
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
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
                            {
                              kind: "not-source",
                            },
                          ],
                        },
                      },
                    },
                    effect: {
                      kind: "wake",
                      subject: {
                        kind: "bound",
                        binding: "woken-object",
                      },
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

export default rousingSlime;
