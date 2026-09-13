import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanScorchingComet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "50m1nBduUZ",
  slug: "aenean-scorching-comet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "50m1nBduUZ:face:default",
      catalogId: "50m1nBduUZ",
      name: "Aenean Scorching Comet",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Deal 2 damage to target unit.\n\n[Class Bonus] [Level 3+] Deal 4 damage to that unit instead.\n\n[Class Bonus] [Level 6+] Deal 6 damage to that unit instead.",
      abilities: [
        {
          id: "50m1nBduUZ-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit.",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 2,
          },
        },
        {
          id: "50m1nBduUZ-a2",
          kind: "ability-modifier",
          text: "[Class Bonus] [Level 3+] Deal 4 damage to that unit instead.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          operation: {
            kind: "replace-effect",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 4,
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
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
            },
          ],
        },
        {
          id: "50m1nBduUZ-a3",
          kind: "ability-modifier",
          text: "[Class Bonus] [Level 6+] Deal 6 damage to that unit instead.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          operation: {
            kind: "replace-effect",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 6,
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
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 6,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default aeneanScorchingComet;
