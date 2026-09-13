import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crimsonProtectiveTrinket: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "96659ytyj2",
  slug: "crimson-protective-trinket",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "96659ytyj2:face:default",
      catalogId: "96659ytyj2",
      name: "Crimson Protective Trinket",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Crimson Protective Trinket: Target opponent reveals two cards at random from their memory. Banish each wind element card revealed this way.",
      abilities: [
        {
          id: "96659ytyj2-a1",
          kind: "activated",
          text: "Banish Crimson Protective Trinket: Target opponent reveals two cards at random from their memory. Banish each wind element card revealed this way.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
                kind: "reveal",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "revealed-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
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
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    binding: "revealed-memory-cards",
                    filter: {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                  },
                },
                destination: {
                  zone: "banishment",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default crimsonProtectiveTrinket;
