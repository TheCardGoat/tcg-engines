import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forgingHeat: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tjmzM6t9R5",
  slug: "forging-heat",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tjmzM6t9R5:face:default",
      catalogId: "tjmzM6t9R5",
      name: "Forging Heat",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "CRAFT"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a durability counter on target Sword weapon you control. It gets +1POWER until end of turn.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "tjmzM6t9R5-a1",
          kind: "card-resolution",
          text: "Put a durability counter on target Sword weapon you control. It gets +1POWER until end of turn.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SWORD"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "durability",
                amount: 1,
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "tjmzM6t9R5-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default forgingHeat;
