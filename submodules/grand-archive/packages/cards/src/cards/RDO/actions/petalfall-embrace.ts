import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const petalfallEmbrace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uDWTjGarSL",
  slug: "petalfall-embrace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uDWTjGarSL:face:default",
      catalogId: "uDWTjGarSL",
      name: "Petalfall Embrace",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText: "Each player recovers 8+LV. ",
      abilities: [
        {
          id: "uDWTjGarSL-a1",
          kind: "card-resolution",
          text: "Each player recovers 8+LV.",
          effect: {
            kind: "recover",
            player: "each-player",
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                8,
                {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default petalfallEmbrace;
