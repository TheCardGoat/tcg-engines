import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const refreshChamber: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7nk45swaf8",
  slug: "refresh-chamber",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7nk45swaf8:face:default",
      catalogId: "7nk45swaf8",
      name: "Refresh Chamber",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Materialize a Bullet card from your material deck. Then you may banish a card with floating memory from your graveyard. If you do, put Refresh Chamber into its owner's memory. (You still pay for the costs of the materialization.)",
      abilities: [
        {
          id: "7nk45swaf8-a1",
          kind: "card-resolution",
          text: "Materialize a Bullet card from your material deck. Then you may banish a card with floating memory from your graveyard. If you do, put Refresh Chamber into its owner's memory. (You still pay for the costs of the materialization.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "materialized-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["material-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["BULLET"],
                    },
                  },
                },
                effect: {
                  kind: "materialize-card",
                  subject: {
                    kind: "bound",
                    binding: "materialized-card",
                  },
                },
              },
              {
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
                            kind: "has-keyword",
                            keyword: "floating-memory",
                          },
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "source",
                      },
                      destination: {
                        zone: "memory",
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

export default refreshChamber;
