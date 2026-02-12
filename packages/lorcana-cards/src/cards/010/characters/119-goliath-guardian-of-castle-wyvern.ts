import type { CharacterCard } from "@tcg/lorcana-types";

export const goliathGuardianOfCastleWyvern: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        type: "gain-lore",
      },
      id: "153-1",
      name: "BE CAREFUL, ALL OF YOU",
      text: "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore.",
      trigger: {
        event: "challenge",
        on: {
          controller: "you",
          classification: "Gargoyle",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      condition: {
        comparison: "greater-or-equal",
        controller: "you",
        type: "resource-count",
        value: 0,
        what: "cards-in-hand",
      },
      effect: {
        restriction: "cant-ready",
        target: "SELF",
        type: "restriction",
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
