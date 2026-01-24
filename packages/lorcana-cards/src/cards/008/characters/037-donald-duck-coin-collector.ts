import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckCoinCollector: CharacterCard = {
  id: "1pf",
  cardType: "character",
  name: "Donald Duck",
  version: "Coin Collector",
  fullName: "Donald Duck - Coin Collector",
  inkType: ["amber"],
  set: "008",
  text: 'HERE, PIGGY, PIGGY For each item named The Nephews\' Piggy Bank you have in play, you pay 2 {I} less to play this character.\nMONEY EVERYWHERE When you play this character, your other characters gain "{E} – Draw a card" this turn.',
  cost: 8,
  strength: 4,
  willpower: 8,
  lore: 2,
  cardNumber: 37,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dd6c52d4053aac638074d3abc199bab3ea390b4b",
  },
  abilities: [
    {
      id: "1pf-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "HERE, PIGGY, PIGGY For each item named The Nephews' Piggy Bank you have in play, you pay 2 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
