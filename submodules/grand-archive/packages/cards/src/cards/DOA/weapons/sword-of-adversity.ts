import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swordOfAdversity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dpu9pHGX48",
  slug: "sword-of-adversity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dpu9pHGX48:face:default",
      catalogId: "dpu9pHGX48",
      name: "Sword of Adversity",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] Sword of Adversity gets +1 POWER as long as you control no allies. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "dpu9pHGX48-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Sword of Adversity gets +1 POWER as long as you control no allies. (Apply this effect only if your champion's class matches this card's class.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "not",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
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

export default swordOfAdversity;
