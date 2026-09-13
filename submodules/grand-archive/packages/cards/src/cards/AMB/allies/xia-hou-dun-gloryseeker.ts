import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const xiaHouDunGloryseeker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gc18dq28my",
  slug: "xia-hou-dun-gloryseeker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gc18dq28my:face:default",
      catalogId: "gc18dq28my",
      name: "Xia Hou Dun, Gloryseeker",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR", "RANGER"],
        subtypes: ["WARRIOR", "RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\n[Class Bonus] As long as you control a Sword or Bow weapon, Xia Hou Dun gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "gc18dq28my-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "gc18dq28my-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you control a Sword or Bow weapon, Xia Hou Dun gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
                kind: "collection-exists",
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
                        kind: "any",
                        filters: [
                          {
                            kind: "subtype",
                            oneOf: ["SWORD"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["BOW"],
                          },
                        ],
                      },
                    ],
                  },
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

export default xiaHouDunGloryseeker;
