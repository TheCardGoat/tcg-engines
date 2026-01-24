import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellTheMidasTouch: CharacterCard = {
  id: "1u9",
  cardType: "character",
  name: "Magica De Spell",
  version: "The Midas Touch",
  fullName: "Magica De Spell - The Midas Touch",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "003",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Magica De Spell.)\nALL MINE Whenever this character quests, gain lore equal to the cost of one of your items in play.",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 0,
  cardNumber: 49,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef7cabaf8dc312d2e7dedf796b1297f7e1cbabaf",
  },
  abilities: [
    {
      id: "1u9-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};
