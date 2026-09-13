import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heirloomOfNatura: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "drIdaGpPJ2",
  slug: "heirloom-of-natura",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "drIdaGpPJ2:face:default",
      catalogId: "drIdaGpPJ2",
      name: "Heirloom of Natura",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "Banish Heirloom of Natura: Choose one—\n• Choose any amount of regalia cards in each opponent's banishment and put them into their owner’s material deck.\n• Each opponent banishes two preserved cards from their material deck.\n\n(3), Banish Heirloom of Natura: Draw a card into your memory.",
      abilities: [
        {
          id: "drIdaGpPJ2-a1",
          kind: "activated",
          text: "Banish Heirloom of Natura: Choose one—\n• Choose any amount of regalia cards in each opponent's banishment and put them into their owner’s material deck.\n• Each opponent banishes two preserved cards from their material deck.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "restore-regalia",
                text: "Choose any amount of regalia cards in each opponent's banishment and put them into their owner’s material deck.",
                effect: {
                  kind: "for-each-player",
                  players: "each-opponent",
                  bindEachAs: "affected-opponent",
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "opponent-regalia",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "any-number",
                      },
                      unique: true,
                      candidates: {
                        kind: "card",
                        zones: ["banishment"],
                        relationship: "zone-of",
                        player: {
                          binding: "affected-opponent",
                        },
                        filter: {
                          kind: "supertype",
                          oneOf: ["REGALIA"],
                        },
                      },
                    },
                    effect: {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "opponent-regalia",
                      },
                      destination: {
                        zone: "material-deck",
                      },
                    },
                  },
                },
              },
              {
                id: "banish-preserved",
                text: "Each opponent banishes two preserved cards from their material deck.",
                effect: {
                  kind: "for-each-player",
                  players: "each-opponent",
                  bindEachAs: "affected-opponent",
                  effect: {
                    kind: "banish",
                    player: {
                      binding: "affected-opponent",
                    },
                    selection: {
                      id: "preserved-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: {
                        binding: "affected-opponent",
                      },
                      count: {
                        kind: "exactly",
                        amount: 2,
                      },
                      unique: true,
                      candidates: {
                        kind: "card",
                        zones: ["material-deck"],
                        relationship: "zone-of",
                        player: {
                          binding: "affected-opponent",
                        },
                        filter: {
                          kind: "object-state",
                          state: "preserved",
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        {
          id: "drIdaGpPJ2-a2",
          kind: "activated",
          text: "(3), Banish Heirloom of Natura: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default heirloomOfNatura;
