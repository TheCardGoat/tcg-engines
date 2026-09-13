import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const meltdown: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ht2tsn0ye3",
  slug: "meltdown",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ht2tsn0ye3:face:default",
      catalogId: "ht2tsn0ye3",
      name: "Meltdown",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion is level 2 or higher.)\n\nDestroy target domain, item, or weapon.",
      abilities: [
        {
          id: "ht2tsn0ye3-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion is level 2 or higher.)",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ht2tsn0ye3-a2",
          kind: "card-resolution",
          text: "Destroy target domain, item, or weapon.",
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
                  oneOf: ["DOMAIN", "ITEM", "WEAPON"],
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
            bindResultAs: "destroyed-object",
          },
        },
      ],
    },
  },
};

export default meltdown;
