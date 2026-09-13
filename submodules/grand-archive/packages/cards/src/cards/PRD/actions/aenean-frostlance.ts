import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanFrostlance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NXGaB1dYwL",
  slug: "aenean-frostlance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NXGaB1dYwL:face:default",
      catalogId: "NXGaB1dYwL",
      name: "Aenean Frostlance",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 damage to target unit.\n\n[Class Bonus] [Level 3+] If that unit is rested, deal 4 damage to it instead.\n\n[Class Bonus] [Level 6+] If that unit is rested, deal 8 damage to it instead.",
      abilities: [
        {
          id: "NXGaB1dYwL-a1",
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
          id: "NXGaB1dYwL-a2",
          kind: "ability-modifier",
          text: "[Class Bonus] [Level 3+] If that unit is rested, deal 4 damage to it instead.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          when: {
            kind: "object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "rested",
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
          id: "NXGaB1dYwL-a3",
          kind: "ability-modifier",
          text: "[Class Bonus] [Level 6+] If that unit is rested, deal 8 damage to it instead.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          when: {
            kind: "object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "rested",
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
              amount: 8,
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

export default aeneanFrostlance;
