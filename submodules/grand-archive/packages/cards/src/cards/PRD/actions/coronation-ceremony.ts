import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const coronationCeremony: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y4PZCiE26a",
  slug: "coronation-ceremony",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y4PZCiE26a:face:default",
      catalogId: "y4PZCiE26a",
      name: "Coronation Ceremony",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 2 less to activate if it targets a unique ally.\n\nTarget unit gains spellshroud until end of turn. (Objects with spellshroud can’t be targeted by Spells.)",
      abilities: [
        {
          id: "y4PZCiE26a-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate if it targets a unique ally.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["UNIQUE"],
                    },
                  ],
                },
                quantifier: "any",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "y4PZCiE26a-a2",
          kind: "card-resolution",
          text: "Target unit gains spellshroud until end of turn. (Objects with spellshroud can’t be targeted by Spells.)",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
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
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "spellshroud",
              },
            },
          },
        },
      ],
    },
  },
};

export default coronationCeremony;
