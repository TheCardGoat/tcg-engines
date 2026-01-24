import type { CharacterCard } from "@tcg/lorcana-types";

export const beagleBoysSmalltimeCrooks: CharacterCard = {
  id: "f1x",
  cardType: "character",
  name: "Beagle Boys",
  version: "Small-Time Crooks",
  fullName: "Beagle Boys - Small-Time Crooks",
  inkType: ["ruby", "sapphire"],
  franchise: "Ducktales",
  set: "007",
  text: "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 132,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3640f3d03075b83c26d1c507eb09571e3f2a2efa",
  },
  abilities: [
    {
      id: "f1x-1",
      type: "triggered",
      name: "HURRY IT UP!",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "SELF",
        duration: "this-turn",
      },
      text: "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
