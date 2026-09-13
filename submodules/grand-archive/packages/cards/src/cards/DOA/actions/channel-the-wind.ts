import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const channelTheWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6YiMaCGsfV",
  slug: "channel-the-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6YiMaCGsfV:face:default",
      catalogId: "6YiMaCGsfV",
      name: "Channel the Wind",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "6YiMaCGsfV-a1",
          kind: "card-resolution",
          text: "Put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
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
        {
          id: "6YiMaCGsfV-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default channelTheWind;
