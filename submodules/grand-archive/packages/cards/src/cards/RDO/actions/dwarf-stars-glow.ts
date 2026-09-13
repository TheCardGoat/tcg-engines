import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dwarfStarsGlow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zVubkJC3ce",
  slug: "dwarf-stars-glow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zVubkJC3ce:face:default",
      catalogId: "zVubkJC3ce",
      name: "Dwarf Star's Glow",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Starcalling — (1) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)\n\nDeal 2 damage to target unit. If Dwarf Star's Glow was starcalled, put it into its owner's memory.",
      abilities: [
        {
          id: "zVubkJC3ce-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (1) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
          },
        },
        {
          id: "zVubkJC3ce-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. If Dwarf Star's Glow was starcalled, put it into its owner's memory.",
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
                amount: 2,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "starcalled",
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "memory",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default dwarfStarsGlow;
