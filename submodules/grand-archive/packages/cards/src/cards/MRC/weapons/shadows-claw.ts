import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shadowsClaw: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vm4kj3q2sv",
  slug: "shadows-claw",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vm4kj3q2sv:face:default",
      catalogId: "vm4kj3q2sv",
      name: "Shadow's Claw",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "As long as you have four or more preparation counters on your champion, you may activate this card from your material deck.\n\n[Tristan Bonus] Phantasia allies you control can attack using Shadow's Claw. When they do, put a durability counter on Shadow's Claw.",
      abilities: [
        {
          id: "vm4kj3q2sv-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have four or more preparation counters on your champion, you may activate this card from your material deck.",
          functionalZones: ["material-deck"],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "preparation",
                  },
                  operator: "gte",
                  right: 4,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "vm4kj3q2sv-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Tristan Bonus] Phantasia allies you control can attack using Shadow's Claw. When they do, put a durability counter on Shadow's Claw.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tristan",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "use-weapon-for-attack",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["PHANTASIA"],
                      },
                    ],
                  },
                },
              },
              using: {
                kind: "source",
              },
              actionResult: {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "durability",
                amount: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default shadowsClaw;
