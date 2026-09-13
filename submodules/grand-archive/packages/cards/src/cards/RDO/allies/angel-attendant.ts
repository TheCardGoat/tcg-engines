import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const angelAttendant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "92mnQJPfR8",
  slug: "angel-attendant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "92mnQJPfR8:face:default",
      catalogId: "92mnQJPfR8",
      name: "Angel Attendant",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "Advanced Imbue 1 (You may reserve all cards revealed as you activate this card. If at least one of them is advanced element, this card becomes imbued.)\n\nAs long as Angel Attendant is imbued, it has intercept.\n\nOn Death: Draw a card.\n\n",
      abilities: [
        {
          id: "92mnQJPfR8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Advanced Imbue 1 (You may reserve all cards revealed as you activate this card. If at least one of them is advanced element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 1,
            elementRequirement: "advanced",
          },
        },
        {
          id: "92mnQJPfR8-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Angel Attendant is imbued, it has intercept.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "imbued",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "intercept",
                },
              },
            },
          ],
        },
        {
          id: "92mnQJPfR8-a3",
          kind: "triggered",
          text: "On Death: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default angelAttendant;
