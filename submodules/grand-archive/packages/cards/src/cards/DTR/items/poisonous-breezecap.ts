import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poisonousBreezecap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e3ldc3r8j7",
  slug: "poisonous-breezecap",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e3ldc3r8j7:face:default",
      catalogId: "e3ldc3r8j7",
      name: "Poisonous Breezecap",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "MUSHROOM"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "If Poisonous Breezecap would be suppressed, you may sacrifice it instead. If you do, each opponent banishes a card at random from their memory.\n\nOn Enter: Draw a card into your memory.",
      abilities: [
        {
          id: "e3ldc3r8j7-a1",
          kind: "static",
          staticKind: "effects",
          text: "If Poisonous Breezecap would be suppressed, you may sacrifice it instead. If you do, each opponent banishes a card at random from their memory.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "keyword-action-performed",
                action: "suppress",
                subject: {
                  kind: "source",
                },
              },
              optionalFor: "controller",
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
              },
              afterApply: {
                kind: "banish",
                player: "each-opponent",
                selection: {
                  id: "random-opponent-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "each-opponent",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  method: "random",
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "each-opponent",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "e3ldc3r8j7-a2",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default poisonousBreezecap;
