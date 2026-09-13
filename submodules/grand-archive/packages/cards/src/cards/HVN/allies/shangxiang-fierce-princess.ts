import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shangxiangFiercePrincess: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s2tzwv1uw3",
  slug: "shangxiang-fierce-princess",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s2tzwv1uw3:face:default",
      catalogId: "s2tzwv1uw3",
      name: "Shangxiang, Fierce Princess",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are norm element, this card becomes imbued.)\n\nIf damage would be dealt to Shangxiang from a non-norm element source while Shangxiang is imbued, prevent 2 of that damage.",
      abilities: [
        {
          id: "s2tzwv1uw3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are norm element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "s2tzwv1uw3-a2",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to Shangxiang from a non-norm element source while Shangxiang is imbued, prevent 2 of that damage.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "not",
                    filter: {
                      kind: "element",
                      oneOf: ["NORM"],
                    },
                  },
                },
              },
              condition: {
                kind: "activation-state",
                state: "imbued",
              },
              operation: {
                kind: "prevent",
                amount: 2,
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
      ],
    },
  },
};

export default shangxiangFiercePrincess;
