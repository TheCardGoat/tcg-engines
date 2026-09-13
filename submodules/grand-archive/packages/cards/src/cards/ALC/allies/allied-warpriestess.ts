import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const alliedWarpriestess: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2tsn0ye3ae",
  slug: "allied-warpriestess",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2tsn0ye3ae:face:default",
      catalogId: "2tsn0ye3ae",
      name: "Allied Warpriestess",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "GUARDIAN"],
        subtypes: ["CLERIC", "GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Allied Warpriestess gets +1 POWER.\n\n[Memory 4+] On Attack: Recover 2. (To recover, remove that many damage counters from your champion. Apply this effect only if there are four or more cards in your memory.)",
      abilities: [
        {
          id: "2tsn0ye3ae-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Allied Warpriestess gets +1 POWER.",
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
          id: "2tsn0ye3ae-a2",
          kind: "triggered",
          text: "[Memory 4+] On Attack: Recover 2. (To recover, remove that many damage counters from your champion. Apply this effect only if there are four or more cards in your memory.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
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
          effect: {
            kind: "recover",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default alliedWarpriestess;
