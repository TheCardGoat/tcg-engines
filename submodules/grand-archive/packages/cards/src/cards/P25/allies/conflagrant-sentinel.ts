import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conflagrantSentinel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "puyzn48srd",
  slug: "conflagrant-sentinel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "puyzn48srd:face:default",
      catalogId: "puyzn48srd",
      name: "Conflagrant Sentinel",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "On Enter: You may discard a card. If you do, put a buff counter on Conflagrant Sentinel. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "puyzn48srd-a1",
          kind: "triggered",
          text: "On Enter: You may discard a card. If you do, put a buff counter on Conflagrant Sentinel. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "discard",
                  player: "controller",
                  selection: {
                    id: "discarded-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default conflagrantSentinel;
