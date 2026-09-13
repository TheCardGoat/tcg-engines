import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pyroclasticFlow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4wiffei7ch",
  slug: "pyroclastic-flow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4wiffei7ch:face:default",
      catalogId: "4wiffei7ch",
      name: "Pyroclastic Flow",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText: "Deal 2 damage to all units.",
      abilities: [
        {
          id: "4wiffei7ch-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to all units.",
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default pyroclasticFlow;
