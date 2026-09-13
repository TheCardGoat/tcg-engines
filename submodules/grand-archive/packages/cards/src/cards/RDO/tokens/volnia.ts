import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const volnia: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "CjWMdce0Ke",
  slug: "volnia",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "CjWMdce0Ke:face:default",
      catalogId: "CjWMdce0Ke",
      name: "Volnia",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HERB", "ADJUVANT", "CATALYST", "FLOWER"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Sacrifice Volnia: As a Spell, deal 1 damage to target unit.\n\n(4), Sacrifice Volnia: As a Spell, deal 4 damage to target unit.",
      abilities: [
        {
          id: "CjWMdce0Ke-a1",
          kind: "activated",
          text: "Sacrifice Volnia: As a Spell, deal 1 damage to target unit.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
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
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 1,
            },
          },
        },
        {
          id: "CjWMdce0Ke-a2",
          kind: "activated",
          text: "(4), Sacrifice Volnia: As a Spell, deal 4 damage to target unit.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
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
            kind: "perform-as",
            sourceKind: "spell",
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
        },
      ],
    },
  },
};

export default volnia;
