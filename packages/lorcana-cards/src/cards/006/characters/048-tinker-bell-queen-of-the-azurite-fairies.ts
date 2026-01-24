import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellQueenOfTheAzuriteFairies: CharacterCard = {
  id: "18r",
  cardType: "character",
  name: "Tinker Bell",
  version: "Queen of the Azurite Fairies",
  fullName: "Tinker Bell - Queen of the Azurite Fairies",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)\nEvasive (Only characters with Evasive can challenge this character.)\nSHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 48,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a14b9855899fc7d42931d6539a133ec95160f245",
  },
  abilities: [
    {
      id: "18r-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "18r-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "18r-3",
      type: "triggered",
      name: "SHINING EXAMPLE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "SHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Queen", "Fairy", "Captain"],
};
