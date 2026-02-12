import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookThePirateKing: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1na-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
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
      id: "1na-2",
      text: "GIVE ’EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn.",
      type: "static",
    },
  ],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "King", "Pirate", "Captain"],
  cost: 5,
  externalIds: {
    ravensburger: "d5b15fd6dd19340f237112bdc1e581bdaa0a13ea",
  },
  franchise: "Peter Pan",
  fullName: "Captain Hook - The Pirate King",
  id: "1na",
  inkType: ["emerald", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Captain Hook",
  set: "008",
  strength: 4,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nGIVE ’EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
  version: "The Pirate King",
  willpower: 5,
};
