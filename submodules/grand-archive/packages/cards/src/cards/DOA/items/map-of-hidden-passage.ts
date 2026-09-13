import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mapOfHiddenPassage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2bzajcZZRD",
  slug: "map-of-hidden-passage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2bzajcZZRD:face:default",
      catalogId: "2bzajcZZRD",
      name: "Map of Hidden Passage",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "MAP"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Map of Hidden Passage enters the field rested.\n\nREST, Banish Map of Hidden Passage: Until end of turn, units with stealth can't be intercepted.",
      abilities: [
        {
          id: "2bzajcZZRD-a1",
          kind: "static",
          staticKind: "effects",
          text: "Map of Hidden Passage enters the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "2bzajcZZRD-a2",
          kind: "activated",
          text: "REST, Banish Map of Hidden Passage: Until end of turn, units with stealth can't be intercepted.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "rule-modification",
            mode: "forbid",
            action: "intercept",
            against: {
              kind: "attacks-by",
              attacker: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "has-keyword",
                        keyword: "stealth",
                      },
                    ],
                  },
                },
              },
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default mapOfHiddenPassage;
