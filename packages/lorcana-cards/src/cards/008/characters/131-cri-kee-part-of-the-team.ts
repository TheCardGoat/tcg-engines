import type { CharacterCard } from "@tcg/lorcana-types";

export const crikeePartOfTheTeam: CharacterCard = {
  id: "17k",
  cardType: "character",
  name: "Cri-Kee",
  version: "Part of the Team",
  fullName: "Cri-Kee - Part of the Team",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "008",
  text: "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 131,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9d087d32f656197a9ff3c8e60cf33a925d94003d",
  },
  abilities: [
    {
      id: "17k-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      text: "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
