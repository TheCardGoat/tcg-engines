import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseAmberChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
      id: "12o-1",
      name: "LEADING THE WAY Your other Amber",
      text: "LEADING THE WAY Your other Amber characters get +2 {W}.",
      type: "static",
    },
  ],
  cardNumber: 23,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "8b5bb1ddb1139b3e466d0eef356d18aa520cb49c",
  },
  fullName: "Mickey Mouse - Amber Champion",
  id: "12o",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Mickey Mouse",
  set: "010",
  strength: 2,
  text: "LEADING THE WAY Your other Amber characters get +2 {W}.\nFRIENDLY CHORUS While you have 2 or more other Amber characters in play, this character gains Singer 8. (They count as cost 8 to sing songs.)",
  version: "Amber Champion",
  willpower: 5,
};
