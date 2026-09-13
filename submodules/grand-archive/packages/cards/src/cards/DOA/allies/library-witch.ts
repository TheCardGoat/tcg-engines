import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const libraryWitch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iD8qbpA8z5",
  slug: "library-witch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iD8qbpA8z5:face:default",
      catalogId: "iD8qbpA8z5",
      name: "Library Witch",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nOn Death: Draw a card. ",
      abilities: [
        {
          id: "iD8qbpA8z5-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "iD8qbpA8z5-a2",
          kind: "triggered",
          text: "On Death: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
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

export default libraryWitch;
