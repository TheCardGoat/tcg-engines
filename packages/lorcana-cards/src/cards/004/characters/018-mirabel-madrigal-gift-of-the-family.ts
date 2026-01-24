import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalGiftOfTheFamily: CharacterCard = {
  id: "1a6",
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Gift of the Family",
  fullName: "Mirabel Madrigal - Gift of the Family",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSAVING THE MIRACLE Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 18,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "a80ea3347166fc9a06f7ab61484c236899f23496",
  },
  abilities: [
    {
      id: "1a6-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "1a6-2",
      type: "triggered",
      name: "SAVING THE MIRACLE",
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
      text: "SAVING THE MIRACLE Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Madrigal"],
};
