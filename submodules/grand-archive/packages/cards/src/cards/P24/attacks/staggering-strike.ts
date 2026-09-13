import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const staggeringStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "opb1wdktia",
  slug: "staggering-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "opb1wdktia:face:default",
      catalogId: "opb1wdktia",
      name: "Staggering Strike",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "True Sight (This attack can target units with stealth.)\n\nOn Champion Hit: Remove three preparation counters from the hit champion.",
      abilities: [
        {
          id: "opb1wdktia-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "True Sight (This attack can target units with stealth.)",
          keyword: {
            name: "true-sight",
          },
        },
        {
          id: "opb1wdktia-a2",
          kind: "triggered",
          text: "On Champion Hit: Remove three preparation counters from the hit champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "remove-counter",
            subject: {
              kind: "event-recipient",
            },
            counter: "preparation",
            amount: 3,
            bindResultAs: "removed-counters",
          },
        },
      ],
    },
  },
};

export default staggeringStrike;
