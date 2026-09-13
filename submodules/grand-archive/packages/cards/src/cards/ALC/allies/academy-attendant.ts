import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const academyAttendant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m4c8ljyevp",
  slug: "academy-attendant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m4c8ljyevp:face:default",
      catalogId: "m4c8ljyevp",
      name: "Academy Attendant",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] [Memory 4+] Academy Attendant gets +1 POWER. (Apply this effect only if your champion's class matches this card's class and only if there are four or more cards in your memory.)",
      abilities: [
        {
          id: "m4c8ljyevp-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Memory 4+] Academy Attendant gets +1 POWER. (Apply this effect only if your champion's class matches this card's class and only if there are four or more cards in your memory.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "memory-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                  operator: "gte",
                  right: 4,
                },
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
      ],
    },
  },
};

export default academyAttendant;
