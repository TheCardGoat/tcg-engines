import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sigilOfBuddingEmbers: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g31dg6zl3j",
  slug: "sigil-of-budding-embers",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g31dg6zl3j:face:default",
      catalogId: "g31dg6zl3j",
      name: "Sigil of Budding Embers",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\n[Diao Chan Bonus] REST, Remove X glimmer counters from your champion, Banish Sigil of Budding Embers: As a Spell, deal X damage to target champion.",
      abilities: [
        {
          id: "g31dg6zl3j-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "g31dg6zl3j-a2",
          kind: "activated",
          text: "[Diao Chan Bonus] REST, Remove X glimmer counters from your champion, Banish Sigil of Budding Embers: As a Spell, deal X damage to target champion.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "glimmer",
                },
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              {
                kind: "banish-self",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
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
              amount: {
                kind: "variable",
                symbol: "X",
              },
            },
          },
        },
      ],
    },
  },
};

export default sigilOfBuddingEmbers;
