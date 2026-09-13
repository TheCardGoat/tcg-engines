import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const senarisSixOfDiamonds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EIpkYYSP3s",
  slug: "senaris-six-of-diamonds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EIpkYYSP3s:face:default",
      catalogId: "EIpkYYSP3s",
      name: "Senaris, Six of Diamonds",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Spellshroud, Stealth\n\nCardistry — (6): The next three times a Suited Spell source you control would deal damage this turn, it deals that much plus 3 damage instead. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "EIpkYYSP3s-a1",
          kind: "keyword-group",
          text: "Spellshroud, Stealth",
          keywords: [
            {
              name: "spellshroud",
            },
            {
              name: "stealth",
            },
          ],
        },
        {
          id: "EIpkYYSP3s-a2",
          kind: "activated",
          text: "Cardistry — (6): The next three times a Suited Spell source you control would deal damage this turn, it deals that much plus 3 damage instead. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
          label: {
            name: "Cardistry",
          },
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: {
              kind: "calculate",
              operator: "maximum",
              operands: [
                {
                  kind: "calculate",
                  operator: "subtract",
                  operands: [
                    6,
                    {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["SUITED"],
                        },
                      },
                      distinctBy: "reserve-cost",
                    },
                  ],
                },
                0,
              ],
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
            operation: {
              kind: "modify-amount",
              operation: "add",
              amount: 3,
            },
            limit: {
              count: 3,
              per: "source-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default senarisSixOfDiamonds;
