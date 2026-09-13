import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blindingLapse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rKKDhaLJ8w",
  slug: "blinding-lapse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rKKDhaLJ8w:face:default",
      catalogId: "rKKDhaLJ8w",
      name: "Blinding Lapse",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["LUXEM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target opponent with influence nine or more puts all cards from their hand into their memory. Then that player banishes three cards at random from their memory. (A player’s influence is equal to the total amount of cards in their hand and memory.)",
      abilities: [
        {
          id: "rKKDhaLJ8w-a1",
          kind: "card-resolution",
          text: "Target opponent with influence nine or more puts all cards from their hand into their memory. Then that player banishes three cards at random from their memory. (A player’s influence is equal to the total amount of cards in their hand and memory.)",
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
                property: {
                  name: "influence",
                  operator: "gte",
                  value: 9,
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["hand"],
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
                from: "hand",
                destination: {
                  zone: "memory",
                },
              },
              {
                kind: "banish",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "random-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-opponent",
                  },
                  method: "random",
                  count: {
                    kind: "exactly",
                    amount: 3,
                  },
                  unique: true,
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
            ],
          },
        },
      ],
    },
  },
};

export default blindingLapse;
