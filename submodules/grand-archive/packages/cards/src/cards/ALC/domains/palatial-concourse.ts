import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const palatialConcourse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c7wklzjmwu",
  slug: "palatial-concourse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c7wklzjmwu:face:default",
      catalogId: "c7wklzjmwu",
      name: "Palatial Concourse",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CROSSROADS"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, glimpse 1. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "c7wklzjmwu-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, glimpse 1. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default palatialConcourse;
