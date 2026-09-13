import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const igniteFate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "267kgpwjmc",
  slug: "ignite-fate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "267kgpwjmc:face:default",
      catalogId: "267kgpwjmc",
      name: "Ignite Fate",
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
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Deal 2 damage to each champion. \n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "267kgpwjmc-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to each champion.",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
            amount: 2,
          },
        },
        {
          id: "267kgpwjmc-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default igniteFate;
