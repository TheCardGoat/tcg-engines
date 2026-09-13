import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crimsonRupture: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qeZRvGbXkF",
  slug: "crimson-rupture",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qeZRvGbXkF:face:default",
      catalogId: "qeZRvGbXkF",
      name: "Crimson Rupture",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Damage 20+] This card costs 2 less to activate. (Apply this effect only if there are twenty or more damage counters on your champion.)\n\nDestroy target item or weapon.",
      abilities: [
        {
          id: "qeZRvGbXkF-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Damage 20+] This card costs 2 less to activate. (Apply this effect only if there are twenty or more damage counters on your champion.)",
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 20,
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qeZRvGbXkF-a2",
          kind: "card-resolution",
          text: "Destroy target item or weapon.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ITEM", "WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default crimsonRupture;
