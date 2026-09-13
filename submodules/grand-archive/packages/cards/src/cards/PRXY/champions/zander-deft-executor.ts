import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zanderDeftExecutor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fc4ic5fmaa",
  slug: "zander-deft-executor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fc4ic5fmaa:face:default",
      catalogId: "fc4ic5fmaa",
      name: "Zander, Deft Executor",
      lineageName: "Zander",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Zander Lineage\n\nOn Enter: Put two preparation counters on Zander. Then you may remove a preparation counter from him. If you do, return an Assassin action or an Assassin attack card from your graveyard to your hand.",
      abilities: [
        {
          id: "fc4ic5fmaa-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Zander Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Zander",
          },
        },
        {
          id: "fc4ic5fmaa-a2",
          kind: "triggered",
          text: "On Enter: Put two preparation counters on Zander. Then you may remove a preparation counter from him. If you do, return an Assassin action or an Assassin attack card from your graveyard to your hand.",
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
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "preparation",
                amount: 2,
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "remove-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: "preparation",
                      amount: 1,
                    },
                    {
                      kind: "choose",
                      selection: {
                        id: "returned-assassin-card",
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
                            kind: "all",
                            filters: [
                              {
                                kind: "subtype",
                                oneOf: ["ASSASSIN"],
                              },
                              {
                                kind: "type",
                                oneOf: ["ACTION", "ATTACK"],
                              },
                            ],
                          },
                        },
                      },
                      effect: {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "returned-assassin-card",
                        },
                        from: "graveyard",
                        destination: {
                          zone: "hand",
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

export default zanderDeftExecutor;
