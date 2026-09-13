import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reposition: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vfq3huqj5b",
  slug: "reposition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vfq3huqj5b:face:default",
      catalogId: "vfq3huqj5b",
      name: "Reposition",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target unit becomes distant. (Units stay distant until the end of their controller's turn.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "vfq3huqj5b-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant. (Units stay distant until the end of their controller's turn.)",
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
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "vfq3huqj5b-a2",
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

export default reposition;
