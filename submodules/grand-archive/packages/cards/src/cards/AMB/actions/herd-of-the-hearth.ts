import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const herdOfTheHearth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wXsHpcrH3P",
  slug: "herd-of-the-hearth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wXsHpcrH3P:face:default",
      catalogId: "wXsHpcrH3P",
      name: "Herd of the Hearth",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HORSE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        'Animal and Beast allies you control get +1 POWER until end of turn. Horse allies you control also gain "On Attack: Draw a card, then discard a card" until end of turn.\n\n[Class Bonus] Floating Memory',
      abilities: [
        {
          id: "wXsHpcrH3P-a1",
          kind: "card-resolution",
          text: 'Animal and Beast allies you control get +1 POWER until end of turn. Horse allies you control also gain "On Attack: Draw a card, then discard a card" until end of turn.',
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "any",
                          filters: [
                            {
                              kind: "subtype",
                              oneOf: ["ANIMAL"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["BEAST"],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["HORSE"],
                        },
                      ],
                    },
                  },
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-1joldi5-a1",
                    kind: "triggered",
                    text: "On Attack: Draw a card, then discard a card",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "attack-declared",
                        subject: {
                          kind: "source",
                        },
                      },
                    },
                    effect: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "draw",
                          player: "controller",
                          amount: 1,
                        },
                        {
                          kind: "discard",
                          player: "controller",
                          selection: {
                            id: "discarded-card",
                            kind: "choice",
                            declared: "resolution",
                            chooser: "controller",
                            count: {
                              kind: "exactly",
                              amount: 1,
                            },
                            candidates: {
                              kind: "card",
                              zones: ["hand"],
                              relationship: "zone-of",
                              player: "controller",
                            },
                          },
                          bindResultAs: "discarded-card",
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
        {
          id: "wXsHpcrH3P-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default herdOfTheHearth;
