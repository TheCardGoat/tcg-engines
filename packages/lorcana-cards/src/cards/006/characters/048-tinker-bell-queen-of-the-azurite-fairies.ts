import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellQueenOfTheAzuriteFairies: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "18r-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      id: "18r-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "18r-3",
      name: "SHINING EXAMPLE",
      text: "SHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 48,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Queen", "Fairy", "Captain"],
  cost: 7,
  externalIds: {
    ravensburger: "a14b9855899fc7d42931d6539a133ec95160f245",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Queen of the Azurite Fairies",
  id: "18r",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Tinker Bell",
  set: "006",
  strength: 5,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)\nEvasive (Only characters with Evasive can challenge this character.)\nSHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
  version: "Queen of the Azurite Fairies",
  willpower: 6,
};
