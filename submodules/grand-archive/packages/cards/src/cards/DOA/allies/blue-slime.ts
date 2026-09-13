import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blueSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1Sl4Gq2OuV",
  slug: "blue-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1Sl4Gq2OuV:face:default",
      catalogId: "1Sl4Gq2OuV",
      name: "Blue Slime",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Pride 4 (This ally won't obey you unless your champion is level 4 or higher.)\n\n[Class Bonus] Whenever Blue Slime is dealt damage, put a buff counter on it. (Allies get +1 power and +1 life for each buff counter on them.)",
      abilities: [
        {
          id: "1Sl4Gq2OuV-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 4 (This ally won't obey you unless your champion is level 4 or higher.)",
          keyword: {
            name: "pride",
            value: 4,
          },
        },
        {
          id: "1Sl4Gq2OuV-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever Blue Slime is dealt damage, put a buff counter on it. (Allies get +1 power and +1 life for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default blueSlime;
