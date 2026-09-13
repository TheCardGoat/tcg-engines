import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jewelOfEnlightenment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AKA19OwaCh",
  slug: "jewel-of-enlightenment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AKA19OwaCh:face:default",
      catalogId: "AKA19OwaCh",
      name: "Jewel of Enlightenment",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Jewel of Enlightenment: Put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
      abilities: [
        {
          id: "AKA19OwaCh-a1",
          kind: "activated",
          text: "Banish Jewel of Enlightenment: Put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default jewelOfEnlightenment;
