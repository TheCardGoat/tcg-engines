import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const refurbish: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b43adsk77Y",
  slug: "refurbish",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b43adsk77Y:face:default",
      catalogId: "b43adsk77Y",
      name: "Refurbish",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD", "CRAFT"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Put two durability counters on target Sword weapon you control.",
      abilities: [
        {
          id: "b43adsk77Y-a1",
          kind: "card-resolution",
          text: "Put two durability counters on target Sword weapon you control.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SWORD"],
                    },
                  ],
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
            counter: "durability",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default refurbish;
