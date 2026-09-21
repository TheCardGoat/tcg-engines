import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swordOfShadows: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zcvq77mdgd",
  slug: "sword-of-shadows",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zcvq77mdgd:face:default",
      catalogId: "zcvq77mdgd",
      name: "Sword of Shadows",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "DISTORTION", "SWORD"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] Sword of Shadows gets +1POWER.\n\nAs long as an opponent controls an ally with stealth, Sword of Shadows gets -1POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "zcvq77mdgd-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Sword of Shadows gets +1POWER.",
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
          id: "zcvq77mdgd-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as an opponent controls an ally with stealth, Sword of Shadows gets -1POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
                  player: "each-opponent",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "has-keyword",
                        keyword: "stealth",
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
                operation: "subtract",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default swordOfShadows;
