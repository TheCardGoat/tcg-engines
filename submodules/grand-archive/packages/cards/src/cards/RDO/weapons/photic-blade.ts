import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const photicBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NRBO0nVMdl",
  slug: "photic-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NRBO0nVMdl:face:default",
      catalogId: "NRBO0nVMdl",
      name: "Photic Blade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 3,
        durability: 2,
      },
      rulesText:
        "Photic Blade gets +1POWER for each refinement counter on it.\n\n[Class Bonus] Whenever you recover, put a refinement counter on Photic Blade.",
      abilities: [
        {
          id: "NRBO0nVMdl-a1",
          kind: "static",
          staticKind: "effects",
          text: "Photic Blade gets +1POWER for each refinement counter on it.",
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
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "refinement",
                  },
                },
              },
            },
          ],
        },
        {
          id: "NRBO0nVMdl-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you recover, put a refinement counter on Photic Blade.",
          trigger: {
            kind: "event",
            event: {
              name: "player-recovered",
              actor: "controller",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            amount: 1,
          },
        },
      ],
    },
  },
};

export default photicBlade;
