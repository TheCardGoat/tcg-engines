import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prototypePistol: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "frzrplywc0",
  slug: "prototype-pistol",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "frzrplywc0:face:default",
      catalogId: "frzrplywc0",
      name: "Prototype Pistol",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "(Gun — Must be loaded to use for an attack and can't be used with an attack card.)\n\n[Class Bonus] On Enter: Prototype Pistol gets +1 POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "frzrplywc0-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Gun — Must be loaded to use for an attack and can't be used with an attack card.)",
          keyword: {
            name: "gun",
          },
        },
        {
          id: "frzrplywc0-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Prototype Pistol gets +1 POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
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
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
        },
      ],
    },
  },
};

export default prototypePistol;
