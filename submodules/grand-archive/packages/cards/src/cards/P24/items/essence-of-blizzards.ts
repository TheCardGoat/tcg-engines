import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const essenceOfBlizzards: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k1l75tlzsm",
  slug: "essence-of-blizzards",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k1l75tlzsm:face:default",
      catalogId: "k1l75tlzsm",
      name: "Essence of Blizzards",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Brew — One Adjuvant, One Catalyst (You may sacrifice the listed objects rather than pay this card's reserve cost.)\n\nSacrifice Essence of Blizzards: Deal 1 damage to target unit. If that unit is rested, deal 1+LV damage to it instead. Until end of turn, allies enter the field rested.",
      abilities: [
        {
          id: "k1l75tlzsm-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Adjuvant, One Catalyst (You may sacrifice the listed objects rather than pay this card's reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Adjuvant",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Catalyst",
                count: 1,
              },
            ],
          },
        },
        {
          id: "k1l75tlzsm-a2",
          kind: "activated",
          text: "Sacrifice Essence of Blizzards: Deal 1 damage to target unit. If that unit is rested, deal 1+LV damage to it instead. Until end of turn, allies enter the field rested.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-unit",
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
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-unit",
                },
                amount: {
                  kind: "conditional",
                  condition: {
                    kind: "object-state",
                    subject: {
                      kind: "bound",
                      binding: "target-unit",
                    },
                    state: "rested",
                  },
                  then: {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      1,
                      {
                        kind: "property",
                        subject: {
                          kind: "champion",
                          player: "controller",
                        },
                        property: "level",
                        basis: "current",
                      },
                    ],
                  },
                  else: 1,
                },
              },
              {
                kind: "replacement",
                event: {
                  name: "object-entered-field",
                  subject: {
                    kind: "event-object",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                operation: {
                  kind: "modify-object-state",
                  state: "rested",
                  value: true,
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default essenceOfBlizzards;
