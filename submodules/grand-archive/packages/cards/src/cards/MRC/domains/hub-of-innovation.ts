import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hubOfInnovation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aebjlwabip",
  slug: "hub-of-innovation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aebjlwabip:face:default",
      catalogId: "aebjlwabip",
      name: "Hub of Innovation",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CROSSROADS"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "On Enter: Draw a card into your memory.",
      abilities: [
        {
          id: "aebjlwabip-a1",
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

export default hubOfInnovation;
