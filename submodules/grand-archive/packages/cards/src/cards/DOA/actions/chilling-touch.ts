import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chillingTouch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4K2pT3RmTJ",
  slug: "chilling-touch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4K2pT3RmTJ:face:default",
      catalogId: "4K2pT3RmTJ",
      name: "Chilling Touch",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Banish a card at random from target opponent's memory. Return that card to their memory at the beginning of their next end phase.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "4K2pT3RmTJ-a1",
          kind: "card-resolution",
          text: "Banish a card at random from target opponent's memory. Return that card to their memory at the beginning of their next end phase.",
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
                kind: "banish",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "banished-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  method: "random",
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "end",
                    actor: {
                      binding: "target-opponent",
                    },
                  },
                },
                limit: 1,
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "banished-memory-cards",
                  },
                  from: "banishment",
                  destination: {
                    zone: "memory",
                  },
                },
              },
            ],
          },
        },
        {
          id: "4K2pT3RmTJ-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default chillingTouch;
