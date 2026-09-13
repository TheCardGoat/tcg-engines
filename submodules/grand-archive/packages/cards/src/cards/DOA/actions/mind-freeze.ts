import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mindFreeze: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "L9o11y7yfa",
  slug: "mind-freeze",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "L9o11y7yfa:face:default",
      catalogId: "L9o11y7yfa",
      name: "Mind Freeze",
      cost: {
        kind: "reserve",
        amount: 5,
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
        "Banish LV cards at random from target opponent's memory. Return those cards to their memory at the beginning of their next end phase. (LV refers to your champion's level.)\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "L9o11y7yfa-a1",
          kind: "card-resolution",
          text: "Banish LV cards at random from target opponent's memory. Return those cards to their memory at the beginning of their next end phase. (LV refers to your champion's level.)",
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
                    amount: {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
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
          id: "L9o11y7yfa-a2",
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

export default mindFreeze;
