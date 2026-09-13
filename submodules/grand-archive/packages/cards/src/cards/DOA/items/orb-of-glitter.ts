import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const orbOfGlitter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "P7hHZBVScB",
  slug: "orb-of-glitter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "P7hHZBVScB:face:default",
      catalogId: "P7hHZBVScB",
      name: "Orb of Glitter",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, glimpse 1.\n\nBanish Orb of Glitter: Draw a card.",
      abilities: [
        {
          id: "P7hHZBVScB-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, glimpse 1.",
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
        {
          id: "P7hHZBVScB-a2",
          kind: "activated",
          text: "Banish Orb of Glitter: Draw a card.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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

export default orbOfGlitter;
