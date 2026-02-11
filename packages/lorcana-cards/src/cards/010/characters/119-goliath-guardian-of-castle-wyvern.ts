import type { CharacterCard } from "@tcg/lorcana-types";

export const goliathGuardianOfCastleWyvern: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 3,
      },
      id: "153-1",
      name: "BE CAREFUL, ALL OF YOU",
      text: "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore.",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: {
          controller: "you",
          classification: "Gargoyle",
        },
      },
      type: "triggered",
    },
    {
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "greater-or-equal",
        value: 0,
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      id: "153-2",
      name: "STONE BY DAY",
      text: "STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.",
      type: "static",
    },
  ],
  cardNumber: 119,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Gargoyle"],
  cost: 4,
  externalIds: {
    ravensburger: "94203dcc3d9e5f0c52702076c16672e3178043be",
  },
  franchise: "Gargoyles",
  fullName: "Goliath - Guardian of Castle Wyvern",
  id: "153",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Goliath",
  set: "010",
  strength: 5,
  text: "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  version: "Guardian of Castle Wyvern",
  willpower: 5,
};
