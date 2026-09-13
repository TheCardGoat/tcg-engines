import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargeStatic: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lOlMDYL2hc",
  slug: "charge-static",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lOlMDYL2hc:face:default",
      catalogId: "lOlMDYL2hc",
      name: "Charge Static",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText: "Put LV static counters on target arcane element object you control.",
      abilities: [
        {
          id: "lOlMDYL2hc-a1",
          kind: "card-resolution",
          text: "Put LV static counters on target arcane element object you control.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["ARCANE"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "static",
            amount: {
              kind: "property",
              subject: {
                kind: "champion",
                player: "controller",
              },
              property: "level",
              basis: "current",
            },
          },
        },
      ],
    },
  },
};

export default chargeStatic;
