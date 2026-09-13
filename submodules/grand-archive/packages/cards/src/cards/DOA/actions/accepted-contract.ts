import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const acceptedContract: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uZCyXDNJ6I",
  slug: "accepted-contract",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uZCyXDNJ6I:face:default",
      catalogId: "uZCyXDNJ6I",
      name: "Accepted Contract",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Put three preparation counters on your champion.",
      abilities: [
        {
          id: "uZCyXDNJ6I-a1",
          kind: "card-resolution",
          text: "Put three preparation counters on your champion.",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default acceptedContract;
