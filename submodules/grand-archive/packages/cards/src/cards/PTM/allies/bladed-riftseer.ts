import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bladedRiftseer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZSYwzoUEdz",
  slug: "bladed-riftseer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZSYwzoUEdz:face:default",
      catalogId: "ZSYwzoUEdz",
      name: "Bladed Riftseer",
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
        life: 3,
      },
      rulesText:
        "[Level 1+] True Sight (Units with true sight can attack objects with stealth. Apply this effect only if your champion is level 1 or higher.)",
      abilities: [
        {
          id: "ZSYwzoUEdz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 1+] True Sight (Units with true sight can attack objects with stealth. Apply this effect only if your champion is level 1 or higher.)",
          keyword: {
            name: "true-sight",
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
                  right: 1,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default bladedRiftseer;
