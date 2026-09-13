import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const giveBath: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XeXek4dKav",
  slug: "give-bath",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XeXek4dKav:face:default",
      catalogId: "XeXek4dKav",
      name: "Give Bath",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Remove all temporary damage from target ally.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "XeXek4dKav-a1",
          kind: "card-resolution",
          text: "Remove all temporary damage from target ally.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "remove-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "damage",
            counterScope: "temporary",
            amount: {
              kind: "all",
            },
          },
        },
        {
          id: "XeXek4dKav-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
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
          ],
        },
      ],
    },
  },
};

export default giveBath;
