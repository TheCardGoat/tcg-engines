import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const explosiveRune: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1bqry41lw9",
  slug: "explosive-rune",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1bqry41lw9:face:default",
      catalogId: "1bqry41lw9",
      name: "Explosive Rune",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ARTIFACT"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Banish Explosive Rune: Deal 1 damage to target ally. Class Bonus: If that ally is attacking, deal 2 damage to it instead.",
      abilities: [
        {
          id: "1bqry41lw9-a1",
          kind: "activated",
          text: "Banish Explosive Rune: Deal 1 damage to target ally. Class Bonus: If that ally is attacking, deal 2 damage to it instead.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-ally",
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
                  oneOf: ["ALLY"],
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
              binding: "target-ally",
            },
            amount: {
              kind: "conditional",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "champion-matches-source",
                    characteristic: "class",
                  },
                  {
                    kind: "object-state",
                    subject: {
                      kind: "bound",
                      binding: "target-ally",
                    },
                    state: "attacking",
                  },
                ],
              },
              then: 2,
              else: 1,
            },
          },
        },
      ],
    },
  },
};

export default explosiveRune;
