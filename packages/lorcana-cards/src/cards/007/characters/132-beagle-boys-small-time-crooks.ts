import type { CharacterCard } from "@tcg/lorcana-types";

export const beagleBoysSmalltimeCrooks: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "SELF",
        duration: "this-turn",
      },
      id: "f1x-1",
      name: "HURRY IT UP!",
      text: "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 132,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "3640f3d03075b83c26d1c507eb09571e3f2a2efa",
  },
  franchise: "Ducktales",
  fullName: "Beagle Boys - Small-Time Crooks",
  id: "f1x",
  inkType: ["ruby", "sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Beagle Boys",
  set: "007",
  strength: 3,
  text: "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)",
  version: "Small-Time Crooks",
  willpower: 3,
};
