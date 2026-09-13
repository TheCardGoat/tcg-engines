import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const revealTheHidden: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rHccTUUWou",
  slug: "reveal-the-hidden",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rHccTUUWou:face:default",
      catalogId: "rHccTUUWou",
      name: "Reveal the Hidden",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Each unit loses stealth until end of turn. Those units can't gain stealth this turn.\n\n[Level 1+] Draw a card.",
      abilities: [
        {
          id: "rHccTUUWou-a1",
          kind: "card-resolution",
          text: "Each unit loses stealth until end of turn. Those units can't gain stealth this turn.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
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
                  kind: "remove-keyword",
                  keyword: {
                    name: "stealth",
                  },
                },
                bindResultAs: "affected-objects",
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "grant-keyword",
                subject: {
                  kind: "tracked",
                  key: "affected-objects",
                },
                affectedSet: "locked",
                grantedKeyword: {
                  name: "stealth",
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
        {
          id: "rHccTUUWou-a2",
          kind: "card-resolution",
          text: "[Level 1+] Draw a card.",
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
                  right: 1,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default revealTheHidden;
