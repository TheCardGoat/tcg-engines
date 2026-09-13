import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const martialGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nsdwmxz1vd",
  slug: "martial-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nsdwmxz1vd:face:default",
      catalogId: "nsdwmxz1vd",
      name: "Martial Guard",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time target unit would be dealt damage this turn, prevent 2 of that damage.\n\n[Class Bonus] [Level 2+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "nsdwmxz1vd-a1",
          kind: "card-resolution",
          text: "The next time target unit would be dealt damage this turn, prevent 2 of that damage.",
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
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
              amount: 2,
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "nsdwmxz1vd-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] [Level 2+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default martialGuard;
