import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const votiveRuneblade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cnjo0ehqyk",
  slug: "votive-runeblade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cnjo0ehqyk:face:default",
      catalogId: "cnjo0ehqyk",
      name: "Votive Runeblade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: You may sacrifice another Sword regalia. If you do, wake up the attacker.",
      abilities: [
        {
          id: "cnjo0ehqyk-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may sacrifice another Sword regalia. If you do, wake up the attacker.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                    kind: "choose",
                    selection: {
                      id: "sacrificed-object",
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
                                  kind: "supertype",
                                  oneOf: ["REGALIA"],
                                },
                                {
                                  kind: "not-source",
                                },
                                {
                                  kind: "subtype",
                                  oneOf: ["SWORD"],
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
                      kind: "sacrifice",
                      subject: {
                        kind: "bound",
                        binding: "sacrificed-object",
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
                    kind: "wake",
                    subject: {
                      kind: "event-attacker",
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

export default votiveRuneblade;
