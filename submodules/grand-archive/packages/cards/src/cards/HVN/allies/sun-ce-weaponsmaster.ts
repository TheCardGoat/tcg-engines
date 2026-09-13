import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sunCeWeaponsmaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lvxsgng1a1",
  slug: "sun-ce-weaponsmaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lvxsgng1a1:face:default",
      catalogId: "lvxsgng1a1",
      name: "Sun Ce, Weaponsmaster",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] On Enter: Put a durability counter on target Warrior weapon you control. \n\n[Class Bonus] Warrior weapons you control get +1 POWER.",
      abilities: [
        {
          id: "lvxsgng1a1-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put a durability counter on target Warrior weapon you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                      oneOf: ["WARRIOR"],
                    },
                  ],
                },
              },
            },
          ],
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
              kind: "bound",
              binding: "target-1",
            },
            counter: "durability",
            amount: 1,
          },
        },
        {
          id: "lvxsgng1a1-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Warrior weapons you control get +1 POWER.",
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
                kind: "each",
                collection: {
                  zones: ["field"],
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
                        oneOf: ["WARRIOR"],
                      },
                    ],
                  },
                },
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default sunCeWeaponsmaster;
