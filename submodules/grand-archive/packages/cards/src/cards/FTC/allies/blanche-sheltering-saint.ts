import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blancheShelteringSaint: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5k1vt1cn1t",
  slug: "blanche-sheltering-saint",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5k1vt1cn1t:face:default",
      catalogId: "5k1vt1cn1t",
      name: "Blanche, Sheltering Saint",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Level 2+] Fast Activation (You may activate this card at fast speed.)\n\nIf another unit you control would be dealt non-combat damage, prevent an amount of that damage equal to the amount of cards in your memory.",
      abilities: [
        {
          id: "5k1vt1cn1t-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 2+] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
          restrictions: [
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
        {
          id: "5k1vt1cn1t-a2",
          kind: "static",
          staticKind: "effects",
          text: "If another unit you control would be dealt non-combat damage, prevent an amount of that damage equal to the amount of cards in your memory.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
                combatDamage: false,
              },
              operation: {
                kind: "prevent",
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["memory"],
                    player: "controller",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default blancheShelteringSaint;
