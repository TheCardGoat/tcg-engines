import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wanderingGlaivier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p6120p3f5d",
  slug: "wandering-glaivier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p6120p3f5d:face:default",
      catalogId: "p6120p3f5d",
      name: "Wandering Glaivier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText: "On Death: Each player draws a card.",
      abilities: [
        {
          id: "p6120p3f5d-a1",
          kind: "triggered",
          text: "On Death: Each player draws a card.",
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
            player: "each-player",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default wanderingGlaivier;
