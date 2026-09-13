import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swordOfAvarice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dmbBXRTVIk",
  slug: "sword-of-avarice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dmbBXRTVIk:face:default",
      catalogId: "dmbBXRTVIk",
      name: "Sword of Avarice",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "On Enter: Draw a card. Class Bonus: Draw two cards instead. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "dmbBXRTVIk-a1",
          kind: "triggered",
          text: "On Enter: Draw a card. Class Bonus: Draw two cards instead. (Apply the additional effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "champion-matches-source",
              characteristic: "class",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 2,
            },
            else: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default swordOfAvarice;
