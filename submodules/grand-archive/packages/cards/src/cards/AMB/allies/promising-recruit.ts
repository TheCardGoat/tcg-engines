import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const promisingRecruit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h57rcfw46q",
  slug: "promising-recruit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h57rcfw46q:face:default",
      catalogId: "h57rcfw46q",
      name: "Promising Recruit",
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
        power: 1,
        life: 2,
      },
      rulesText:
        "[Level 2+] At the beginning of your end phase, put a buff counter on Promising Recruit. (Allies get +1 POWER and +1 LIFE for each buff counter on them. Apply this effect only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "h57rcfw46q-a1",
          kind: "triggered",
          text: "[Level 2+] At the beginning of your end phase, put a buff counter on Promising Recruit. (Allies get +1 POWER and +1 LIFE for each buff counter on them. Apply this effect only if your champion is level 2 or higher.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
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
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default promisingRecruit;
