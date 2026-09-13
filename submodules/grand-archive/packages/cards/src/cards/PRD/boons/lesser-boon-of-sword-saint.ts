import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfSwordSaint: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OSsRmNoETv",
  slug: "lesser-boon-of-sword-saint",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OSsRmNoETv:face:default",
      catalogId: "OSsRmNoETv",
      name: "Lesser Boon of Sword Saint",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Sword weapons you control get +1POWER.\n\nSword weapons you control enter the field with an additional durability counter on them.",
      abilities: [
        {
          id: "OSsRmNoETv-a1",
          kind: "static",
          staticKind: "effects",
          text: "Sword weapons you control get +1POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SWORD"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
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
        {
          id: "OSsRmNoETv-a2",
          kind: "static",
          staticKind: "effects",
          text: "Sword weapons you control enter the field with an additional durability counter on them.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SWORD"],
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: "durability",
                    amount: 1,
                  },
                ],
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

export default lesserBoonOfSwordSaint;
