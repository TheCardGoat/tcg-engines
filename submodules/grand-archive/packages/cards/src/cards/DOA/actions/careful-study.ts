import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const carefulStudy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4NkVdSx9ed",
  slug: "careful-study",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4NkVdSx9ed:face:default",
      catalogId: "4NkVdSx9ed",
      name: "Careful Study",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nPut five enlighten counters on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
      abilities: [
        {
          id: "4NkVdSx9ed-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
          },
        },
        {
          id: "4NkVdSx9ed-a2",
          kind: "card-resolution",
          text: "Put five enlighten counters on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 5,
          },
        },
      ],
    },
  },
};

export default carefulStudy;
