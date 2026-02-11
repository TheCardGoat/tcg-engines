import type { CharacterCard } from "@tcg/lorcana-types";

export const crikeePartOfTheTeam: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      id: "17k-1",
      text: "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 131,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "9d087d32f656197a9ff3c8e60cf33a925d94003d",
  },
  franchise: "Mulan",
  fullName: "Cri-Kee - Part of the Team",
  id: "17k",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Cri-Kee",
  set: "008",
  strength: 4,
  text: "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
  version: "Part of the Team",
  willpower: 3,
};
