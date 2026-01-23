import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookThePirateKing: CharacterCard = {
  id: "1na",
  cardType: "character",
  name: "Captain Hook",
  version: "The Pirate King",
  fullName: "Captain Hook - The Pirate King",
  inkType: ["emerald", "steel"],
  franchise: "Peter Pan",
  set: "008",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nGIVE ’EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 109,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d5b15fd6dd19340f237112bdc1e581bdaa0a13ea",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "King", "Pirate", "Captain"],
};
