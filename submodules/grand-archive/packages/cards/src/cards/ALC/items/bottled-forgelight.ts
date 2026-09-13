import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bottledForgelight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g616r0zadf",
  slug: "bottled-forgelight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g616r0zadf:face:default",
      catalogId: "g616r0zadf",
      name: "Bottled Forgelight",
      cost: {
        kind: "reserve",
        amount: 3,
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
        "Brew — One Razorvine, One Herb\n\nOn Enter: If Bottled Forgelight was brewed, deal 2 damage to target unit.\n\nSacrifice Bottled Forgelight: Deal 2 damage to target unit.",
      abilities: [
        {
          id: "g616r0zadf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Razorvine, One Herb",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Razorvine",
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
          id: "g616r0zadf-a2",
          kind: "triggered",
          text: "On Enter: If Bottled Forgelight was brewed, deal 2 damage to target unit.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                kind: "bound",
                binding: "target-1",
              },
              amount: 2,
            },
          },
        },
        {
          id: "g616r0zadf-a3",
          kind: "activated",
          text: "Sacrifice Bottled Forgelight: Deal 2 damage to target unit.",
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

export default bottledForgelight;
