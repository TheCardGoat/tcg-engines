import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gearHaul: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n70QM0hkc9",
  slug: "gear-haul",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n70QM0hkc9:face:default",
      catalogId: "n70QM0hkc9",
      name: "Gear Haul",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Scavenge 5 for a VelTech item card twice. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "n70QM0hkc9-a1",
          kind: "card-resolution",
          text: "Scavenge 5 for a VelTech item card twice. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
          effect: {
            kind: "repeat",
            count: 2,
            effect: {
              kind: "keyword-action",
              action: "scavenge",
              player: "controller",
              amount: 5,
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ITEM"],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["VELTECH"],
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default gearHaul;
