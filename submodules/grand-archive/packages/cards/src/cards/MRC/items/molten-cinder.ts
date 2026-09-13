import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const moltenCinder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "df9q1vk8ao",
  slug: "molten-cinder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "df9q1vk8ao:face:default",
      catalogId: "df9q1vk8ao",
      name: "Molten Cinder",
      cost: {
        kind: "reserve",
        amount: 2,
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
        "Brew — One Flower, One Herb\n\nOn Enter: If Molten Cinder was brewed, deal 2 damage to each champion.\n\nSacrifice Molten Cinder: Deal 3 damage to target champion that leveled up this turn.",
      abilities: [
        {
          id: "df9q1vk8ao-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Flower, One Herb",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Flower",
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
          id: "df9q1vk8ao-a2",
          kind: "triggered",
          text: "On Enter: If Molten Cinder was brewed, deal 2 damage to each champion.",
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
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              amount: 2,
            },
          },
        },
        {
          id: "df9q1vk8ao-a3",
          kind: "activated",
          text: "Sacrifice Molten Cinder: Deal 3 damage to target champion that leveled up this turn.",
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
                  oneOf: ["CHAMPION"],
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
            amount: 3,
          },
        },
      ],
    },
  },
};

export default moltenCinder;
