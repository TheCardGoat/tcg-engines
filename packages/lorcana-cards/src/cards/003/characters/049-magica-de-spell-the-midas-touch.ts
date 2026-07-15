import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellTheMidasTouch: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1u9-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  cost: 7,
  externalIds: {
    ravensburger: "ef7cabaf8dc312d2e7dedf796b1297f7e1cbabaf",
  },
  franchise: "Ducktales",
  fullName: "Magica De Spell - The Midas Touch",
  id: "1u9",
  inkType: ["amethyst"],
  inkable: false,
  lore: 0,
  missingImplementation: true,
  missingTests: true,
  name: "Magica De Spell",
  set: "003",
  strength: 4,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Magica De Spell.)\nALL MINE Whenever this character quests, gain lore equal to the cost of one of your items in play.",
  version: "The Midas Touch",
  willpower: 6,
};
