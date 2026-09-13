import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const twistedVerdict: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ANrnYgZNgq",
  slug: "twisted-verdict",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ANrnYgZNgq:face:default",
      catalogId: "ANrnYgZNgq",
      name: "Twisted Verdict",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target opponent looks at the top five cards of your deck. They choose two cards from among them and put them into your memory. Then they put the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "ANrnYgZNgq-a1",
          kind: "card-resolution",
          text: "Target opponent looks at the top five cards of your deck. They choose two cards from among them and put them into your memory. Then they put the rest on the bottom of your deck in any order.",
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "looked-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 5,
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
                  id: "memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-opponent",
                  },
                  count: {
                    kind: "exactly",
                    amount: 2,
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
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "memory-cards",
                      },
                      destination: {
                        zone: "memory",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: "memory-cards",
                      },
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: {
                            binding: "target-opponent",
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
      ],
    },
  },
};

export default twistedVerdict;
