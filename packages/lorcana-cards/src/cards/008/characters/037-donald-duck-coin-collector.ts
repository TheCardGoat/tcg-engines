import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckCoinCollector: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1pf-1",
      text: "HERE, PIGGY, PIGGY For each item named The Nephews' Piggy Bank you have in play, you pay 2 {I} less to play this character.",
      type: "action",
    },
  ],
  cardNumber: 37,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 8,
  externalIds: {
    ravensburger: "dd6c52d4053aac638074d3abc199bab3ea390b4b",
  },
  fullName: "Donald Duck - Coin Collector",
  id: "1pf",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Donald Duck",
  set: "008",
  strength: 4,
  text: 'HERE, PIGGY, PIGGY For each item named The Nephews\' Piggy Bank you have in play, you pay 2 {I} less to play this character.\nMONEY EVERYWHERE When you play this character, your other characters gain "{E} – Draw a card" this turn.',
  version: "Coin Collector",
  willpower: 8,
};
