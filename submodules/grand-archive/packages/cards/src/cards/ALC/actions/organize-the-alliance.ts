import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const organizeTheAlliance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ch2bbmoqk2",
  slug: "organize-the-alliance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ch2bbmoqk2:face:default",
      catalogId: "ch2bbmoqk2",
      name: "Organize the Alliance",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target ally becomes fostered.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "ch2bbmoqk2-a1",
          kind: "card-resolution",
          text: "Target ally becomes fostered.",
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
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "fostered",
            value: true,
          },
        },
        {
          id: "ch2bbmoqk2-a2",
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

export default organizeTheAlliance;
