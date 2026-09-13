import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manifestThreat: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jK7LRuTSPh",
  slug: "manifest-threat",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jK7LRuTSPh:face:default",
      catalogId: "jK7LRuTSPh",
      name: "Manifest Threat",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "If target ally has a debuff counter on it, destroy that ally. Otherwise, put a debuff counter on it.\n\nFloating Memory",
      abilities: [
        {
          id: "jK7LRuTSPh-a1",
          kind: "card-resolution",
          text: "If target ally has a debuff counter on it, destroy that ally. Otherwise, put a debuff counter on it.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "has-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: "debuff",
            },
            then: {
              kind: "destroy",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
            },
            else: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: "debuff",
              amount: 1,
            },
          },
        },
        {
          id: "jK7LRuTSPh-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default manifestThreat;
