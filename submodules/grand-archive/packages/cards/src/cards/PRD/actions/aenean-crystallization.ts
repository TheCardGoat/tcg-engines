import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanCrystallization: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YDjxpBd8Fm",
  slug: "aenean-crystallization",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YDjxpBd8Fm:face:default",
      catalogId: "YDjxpBd8Fm",
      name: "Aenean Crystallization",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["EXALTED", "WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nDestroy target rested ally.\n\n[Class Bonus] [Level 6+] Summon a Core Fractal token.",
      abilities: [
        {
          id: "YDjxpBd8Fm-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "YDjxpBd8Fm-a2",
          kind: "card-resolution",
          text: "Destroy target rested ally.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "rested",
                    },
                  ],
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
        {
          id: "YDjxpBd8Fm-a3",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 6+] Summon a Core Fractal token.",
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
                  right: 6,
                },
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Core Fractal",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default aeneanCrystallization;
