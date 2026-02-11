import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalGiftOfTheFamily: CharacterCard = {
  abilities: [
    {
      id: "1a6-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "1a6-2",
      name: "SAVING THE MIRACLE",
      text: "SAVING THE MIRACLE Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 18,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Madrigal"],
  cost: 5,
  externalIds: {
    ravensburger: "a80ea3347166fc9a06f7ab61484c236899f23496",
  },
  franchise: "Encanto",
  fullName: "Mirabel Madrigal - Gift of the Family",
  id: "1a6",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Mirabel Madrigal",
  set: "004",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSAVING THE MIRACLE Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
  version: "Gift of the Family",
  willpower: 5,
};
