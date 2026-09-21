import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const redHareUnrivaledStallion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5du8f077ua",
  slug: "red-hare-unrivaled-stallion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5du8f077ua:face:default",
      catalogId: "5du8f077ua",
      name: "Red Hare, Unrivaled Stallion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER", "WARRIOR"],
        subtypes: ["TAMER", "WARRIOR", "BEAST", "HORSE"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Pride 3 (This ally won't obey you unless your champion is level 3 or higher. You can't attack with, intercept with, or activate abilities of allies that don't obey you.)\n\nAs long as you control a fire or tera element unique Human ally, Red Hare loses pride, and has \"On Attack: You may discard a card. If you do, draw a card.\"",
      abilities: [
        {
          id: "5du8f077ua-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3 (This ally won't obey you unless your champion is level 3 or higher. You can't attack with, intercept with, or activate abilities of allies that don't obey you.)",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "5du8f077ua-a2",
          kind: "static",
          staticKind: "effects",
          text: 'As long as you control a fire or tera element unique Human ally, Red Hare loses pride, and has "On Attack: You may discard a card. If you do, draw a card."',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["FIRE", "TERA"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-keyword",
                keyword: {
                  name: "pride",
                  anyValue: true,
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["FIRE", "TERA"],
                      },
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-fgjeet-a1",
                  kind: "triggered",
                  text: "On Attack: You may discard a card. If you do, draw a card.",
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
                    kind: "optional",
                    player: "controller",
                    allOrNothing: true,
                    effect: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "attempt",
                          effect: {
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
                            kind: "draw",
                            player: "controller",
                            amount: 1,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default redHareUnrivaledStallion;
