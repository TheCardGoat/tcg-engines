import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipGallantDefender: CharacterCard = {
  id: "1f7",
  cardType: "character",
  name: "Prince Phillip",
  version: "Gallant Defender",
  fullName: "Prince Phillip - Gallant Defender",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nBEST DEFENSE Whenever one of your characters is chosen for Support, they gain Resist +1 this turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 152,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bb53658c9147113243c4c288f17f357b4f9b6cb3",
  },
  abilities: [
    {
      id: "1f7-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "1f7-2",
      type: "triggered",
      name: "BEST DEFENSE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        value: 1,
        duration: "this-turn",
      },
      text: "BEST DEFENSE Whenever one of your characters is chosen for Support, they gain Resist +1 this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
