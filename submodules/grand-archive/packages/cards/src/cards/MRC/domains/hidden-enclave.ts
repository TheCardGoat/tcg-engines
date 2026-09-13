import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hiddenEnclave: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1vk8ao8bki",
  slug: "hidden-enclave",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1vk8ao8bki:face:default",
      catalogId: "1vk8ao8bki",
      name: "Hidden Enclave",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "KINGDOM"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "At the beginning of each player’s recollection phase, that player puts the top card of their deck into their graveyard.",
      abilities: [
        {
          id: "1vk8ao8bki-a1",
          kind: "triggered",
          text: "At the beginning of each player’s recollection phase, that player puts the top card of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
            },
          },
          effect: {
            kind: "mill",
            player: "event-actor",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default hiddenEnclave;
