import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const breakApart: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4ns2jbt4hq",
  slug: "break-apart",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4ns2jbt4hq:face:default",
      catalogId: "4ns2jbt4hq",
      name: "Break Apart",
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
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "This card costs 2 more to activate if it targets a regalia.\n\nDestroy target item or weapon.",
      abilities: [
        {
          id: "4ns2jbt4hq-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 more to activate if it targets a regalia.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "ability-target-matches",
                ability: "this",
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
                quantifier: "any",
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4ns2jbt4hq-a2",
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

export default breakApart;
