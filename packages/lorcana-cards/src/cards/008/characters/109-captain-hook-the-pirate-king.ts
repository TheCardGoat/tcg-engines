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
  missingTests: true,
  externalIds: {
    ravensburger: "d5b15fd6dd19340f237112bdc1e581bdaa0a13ea",
  },
  abilities: [
    {
      id: "1na-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "1na-2",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "YOUR_CHARACTERS",
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            target: "SELF",
            value: 2,
            duration: "this-turn",
          },
        ],
      },
      text: "GIVE ’EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn.",
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Pirate", "Captain"],
};
