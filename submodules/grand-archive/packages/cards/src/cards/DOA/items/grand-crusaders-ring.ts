import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const grandCrusadersRing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2gv7DC0KID",
  slug: "grand-crusaders-ring",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2gv7DC0KID:face:default",
      catalogId: "2gv7DC0KID",
      name: "Grand Crusader's Ring",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "RING"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic (You can only have one card with this keyword in your material deck.)\n\nBanish Grand Crusader's Ring: Draw a card.",
      abilities: [
        {
          id: "2gv7DC0KID-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic (You can only have one card with this keyword in your material deck.)",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "2gv7DC0KID-a2",
          kind: "activated",
          text: "Banish Grand Crusader's Ring: Draw a card.",
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

export default grandCrusadersRing;
