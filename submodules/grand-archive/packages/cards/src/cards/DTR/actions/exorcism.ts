import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const exorcism: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4n6dd4f01r",
  slug: "exorcism",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4n6dd4f01r:face:default",
      catalogId: "4n6dd4f01r",
      name: "Exorcism",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "For each ephemeral object each player controls, its controller sacrifices it unless they pay (1).",
      abilities: [
        {
          id: "4n6dd4f01r-a1",
          kind: "card-resolution",
          text: "For each ephemeral object each player controls, its controller sacrifices it unless they pay (1).",
          effect: {
            kind: "for-each",
            collection: {
              zones: ["field"],
              player: "each-player",
              filter: {
                kind: "object-state",
                state: "ephemeral",
              },
            },
            bindEachAs: "affected-object",
            effect: {
              kind: "unless-paid",
              player: {
                controllerOf: "affected-object",
              },
              cost: {
                kind: "pay-reserve",
                amount: 1,
              },
              otherwise: {
                kind: "sacrifice",
                subject: {
                  kind: "bound",
                  binding: "affected-object",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default exorcism;
