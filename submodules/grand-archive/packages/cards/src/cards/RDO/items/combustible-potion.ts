import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const combustiblePotion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GPsEkAfDjy",
  slug: "combustible-potion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GPsEkAfDjy:face:default",
      catalogId: "GPsEkAfDjy",
      name: "Combustible Potion",
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
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Brew — Two Herbs (You may sacrifice the listed objects rather than pay this card’s reserve cost.)\n\nOn Enter: If Combustible Potion was brewed, draw two cards and discard a card.\n\nSacrifice Combustible Potion: Deal 2 damage to target unit.",
      abilities: [
        {
          id: "GPsEkAfDjy-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Herbs (You may sacrifice the listed objects rather than pay this card’s reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 2,
              },
            ],
          },
        },
        {
          id: "GPsEkAfDjy-a2",
          kind: "triggered",
          text: "On Enter: If Combustible Potion was brewed, draw two cards and discard a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "brewed",
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
                {
                  kind: "discard",
                  player: "controller",
                  selection: {
                    id: "discarded-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "GPsEkAfDjy-a3",
          kind: "activated",
          text: "Sacrifice Combustible Potion: Deal 2 damage to target unit.",
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
      ],
    },
  },
};

export default combustiblePotion;
