import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swordSaintsVow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r44lyrzo6o",
  slug: "sword-saints-vow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r44lyrzo6o:face:default",
      catalogId: "r44lyrzo6o",
      name: "Sword Saint's Vow",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] Sword Saint's Vow gets +1 POWER for each durability counter on it.\n[Class Bonus] Whenever you activate a Craft action card, put two durability counters on Sword Saint's Vow.\nOn Hit: Remove a durability counter from Sword Saint's Vow.",
      abilities: [
        {
          id: "r44lyrzo6o-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Sword Saint's Vow gets +1 POWER for each durability counter on it.",
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
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: "durability",
                },
              },
            },
          ],
        },
        {
          id: "r44lyrzo6o-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate a Craft action card, put two durability counters on Sword Saint's Vow.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ACTION"],
                },
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "durability",
            amount: 2,
          },
        },
        {
          id: "r44lyrzo6o-a3",
          kind: "triggered",
          text: "On Hit: Remove a durability counter from Sword Saint's Vow.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "remove-counter",
            subject: {
              kind: "source",
            },
            counter: "durability",
            amount: 1,
            bindResultAs: "removed-counters",
          },
        },
      ],
    },
  },
};

export default swordSaintsVow;
