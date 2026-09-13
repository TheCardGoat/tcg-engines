import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flamewingFowl: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "59ueoujs9f",
  slug: "flamewing-fowl",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "59ueoujs9f:face:default",
      catalogId: "59ueoujs9f",
      name: "Flamewing Fowl",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 1,
      },
      rulesText:
        "[Class Bonus] As long as Flamewing Fowl is attacking a champion, it gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "59ueoujs9f-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as Flamewing Fowl is attacking a champion, it gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "source",
                },
                otherFilter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
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
      ],
    },
  },
};

export default flamewingFowl;
