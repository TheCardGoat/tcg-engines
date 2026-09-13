import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sunglorySentinel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a3v1ybmvpb",
  slug: "sunglory-sentinel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a3v1ybmvpb:face:default",
      catalogId: "a3v1ybmvpb",
      name: "Sunglory Sentinel",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)\n\nAs long as Sunglory Sentinel is fostered and is attacking a champion, it gets +2 POWER.",
      abilities: [
        {
          id: "a3v1ybmvpb-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)",
          keyword: {
            name: "foster",
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
        {
          id: "a3v1ybmvpb-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Sunglory Sentinel is fostered and is attacking a champion, it gets +2 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "object-state",
                    subject: {
                      kind: "source",
                    },
                    state: "fostered",
                  },
                  {
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
                ],
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default sunglorySentinel;
