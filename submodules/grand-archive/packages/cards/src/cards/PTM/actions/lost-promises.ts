import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lostPromises: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gN8uFKSip0",
  slug: "lost-promises",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gN8uFKSip0:face:default",
      catalogId: "gN8uFKSip0",
      name: "Lost Promises",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Alice Bonus] As long as your champion is defending, you may banish six cards from your graveyard to activate this card from your memory without paying its reserve cost.\n\n[Alice Bonus] Deal 3 damage to target attacking unit, then end the combat phase.\n",
      abilities: [
        {
          id: "gN8uFKSip0-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] As long as your champion is defending, you may banish six cards from your graveyard to activate this card from your memory without paying its reserve cost.",
          functionalZones: ["memory"],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "memory",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "defending",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "memory",
              costKind: "reserve",
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 6,
                },
              },
              condition: {
                kind: "object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "defending",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "gN8uFKSip0-a2",
          kind: "card-resolution",
          text: "[Alice Bonus] Deal 3 damage to target attacking unit, then end the combat phase.",
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
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 3,
              },
              {
                kind: "end-phase",
                phase: "combat",
              },
            ],
          },
        },
      ],
    },
  },
};

export default lostPromises;
