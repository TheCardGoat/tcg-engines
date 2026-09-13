import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poweredBishop: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uesdu6o6ea",
  slug: "powered-bishop",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uesdu6o6ea:face:default",
      catalogId: "uesdu6o6ea",
      name: "Powered Bishop",
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
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText: "[Memory 4+] Powered Bishop gets +1 POWER.\n\nOn Death: Summon a Powercell token.",
      abilities: [
        {
          id: "uesdu6o6ea-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Memory 4+] Powered Bishop gets +1 POWER.",
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
          id: "uesdu6o6ea-a2",
          kind: "triggered",
          text: "On Death: Summon a Powercell token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default poweredBishop;
