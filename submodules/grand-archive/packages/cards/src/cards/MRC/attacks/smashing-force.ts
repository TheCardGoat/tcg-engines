import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const smashingForce: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "88rx6p3p5i",
  slug: "smashing-force",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "88rx6p3p5i:face:default",
      catalogId: "88rx6p3p5i",
      name: "Smashing Force",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HAMMER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] On Attack: You may banish two fire element cards from your graveyard. When you do, destroy target item or weapon with memory cost 0 or reserve cost 4 or less.",
      abilities: [
        {
          id: "88rx6p3p5i-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish two fire element cards from your graveyard. When you do, destroy target item or weapon with memory cost 0 or reserve cost 4 or less.",
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
              kind: "reflexive",
              action: {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
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
              consequence: {
                kind: "destroy",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                bindResultAs: "destroyed-object",
              },
              targets: [
                {
                  id: "target-1",
                  kind: "target",
                  declared: "announcement",
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
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ITEM", "WEAPON"],
                        },
                        {
                          kind: "any",
                          filters: [
                            {
                              kind: "numeric",
                              comparison: {
                                left: {
                                  kind: "property",
                                  subject: {
                                    kind: "candidate",
                                  },
                                  property: "memory-cost",
                                  basis: "base",
                                },
                                operator: "lte",
                                right: 0,
                              },
                            },
                            {
                              kind: "numeric",
                              comparison: {
                                left: {
                                  kind: "property",
                                  subject: {
                                    kind: "candidate",
                                  },
                                  property: "reserve-cost",
                                  basis: "base",
                                },
                                operator: "lte",
                                right: 4,
                              },
                            },
                          ],
                        },
                      ],
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

export default smashingForce;
