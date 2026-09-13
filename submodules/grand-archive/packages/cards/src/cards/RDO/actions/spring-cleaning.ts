import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const springCleaning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dZ0Y2ILgZW",
  slug: "spring-cleaning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dZ0Y2ILgZW:face:default",
      catalogId: "dZ0Y2ILgZW",
      name: "Spring Cleaning",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Put one of your omens into your graveyard. If you do, look at the top three cards of your deck. Banish one of them and put an omen counter on it. Put the rest on the bottom of your deck in any order.\n\n[Ciel Bonus] Floating Memory",
      abilities: [
        {
          id: "dZ0Y2ILgZW-a1",
          kind: "card-resolution",
          text: "Put one of your omens into your graveyard. If you do, look at the top three cards of your deck. Banish one of them and put an omen counter on it. Put the rest on the bottom of your deck in any order.",
          effect: {
            kind: "choose",
            selection: {
              id: "graveyard-omen",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "has-counter",
                  counter: "omen",
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "graveyard-omen",
                  },
                  from: "banishment",
                  destination: {
                    zone: "graveyard",
                  },
                },
                {
                  kind: "look-at",
                  player: "controller",
                  selection: {
                    id: "looked-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 3,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["main-deck"],
                      relationship: "zone-of",
                      player: "controller",
                      fromTop: true,
                    },
                  },
                },
                {
                  kind: "choose",
                  selection: {
                    id: "new-omen",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      binding: "looked-cards",
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "banish-object",
                        subject: {
                          kind: "bound",
                          binding: "new-omen",
                        },
                      },
                      {
                        kind: "add-counter",
                        subject: {
                          kind: "bound",
                          binding: "new-omen",
                        },
                        counter: "omen",
                        amount: 1,
                      },
                      {
                        kind: "move",
                        subject: {
                          kind: "binding-remainder",
                          binding: "looked-cards",
                          excluding: "new-omen",
                        },
                        destination: {
                          zone: "main-deck",
                          placement: {
                            kind: "bottom",
                            orderChosenBy: "controller",
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          id: "dZ0Y2ILgZW-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Ciel Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
        },
      ],
    },
  },
};

export default springCleaning;
