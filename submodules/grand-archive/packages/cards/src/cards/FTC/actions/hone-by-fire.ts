import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const honeByFire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yuvuxnrw8q",
  slug: "hone-by-fire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yuvuxnrw8q:face:default",
      catalogId: "yuvuxnrw8q",
      name: "Hone by Fire",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD", "CRAFT"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target Sword weapon you control gets +2 POWER until end of turn. Class Bonus: Put a durability counter on it.",
      abilities: [
        {
          id: "yuvuxnrw8q-a1",
          kind: "card-resolution",
          text: "Target Sword weapon you control gets +2 POWER until end of turn. Class Bonus: Put a durability counter on it.",
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
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
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
                  amount: 2,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "event-subject",
                  },
                  counter: "durability",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default honeByFire;
