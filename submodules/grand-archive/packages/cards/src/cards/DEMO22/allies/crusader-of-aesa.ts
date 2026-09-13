import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crusaderOfAesa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2Q60hBYO3i",
  slug: "crusader-of-aesa",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2Q60hBYO3i:face:default",
      catalogId: "2Q60hBYO3i",
      name: "Crusader of Aesa",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "Crusader of Aesa enters the field rested.\n\n[Class Bonus] Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally. Apply this effect only if your champion's class matches this card's class.) ",
      abilities: [
        {
          id: "2Q60hBYO3i-a1",
          kind: "static",
          staticKind: "effects",
          text: "Crusader of Aesa enters the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "2Q60hBYO3i-a2",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "intercept",
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

export default crusaderOfAesa;
