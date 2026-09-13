import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const explosiveConcoction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yorsltrnu3",
  slug: "explosive-concoction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yorsltrnu3:face:default",
      catalogId: "yorsltrnu3",
      name: "Explosive Concoction",
      cost: {
        kind: "reserve",
        amount: 7,
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
        "Brew — One Leaf, One Herb (You may sacrifice the listed objects rather than pay this card's reserve cost.)\n\nHindered (This object enters the field rested.)\n\nREST, Sacrifice Explosive Concoction: Deal 4 damage to target champion. Draw a card.",
      abilities: [
        {
          id: "yorsltrnu3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Leaf, One Herb (You may sacrifice the listed objects rather than pay this card's reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Leaf",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Herb",
                count: 1,
              },
            ],
          },
        },
        {
          id: "yorsltrnu3-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "yorsltrnu3-a3",
          kind: "activated",
          text: "REST, Sacrifice Explosive Concoction: Deal 4 damage to target champion. Draw a card.",
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
                  oneOf: ["CHAMPION"],
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
                  binding: "target-1",
                },
                amount: 4,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default explosiveConcoction;
