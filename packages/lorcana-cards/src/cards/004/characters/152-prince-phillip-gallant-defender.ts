import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipGallantDefender: CharacterCard = {
  abilities: [
    {
      id: "1f7-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        value: 1,
        duration: "this-turn",
      },
      id: "1f7-2",
      name: "BEST DEFENSE",
      text: "BEST DEFENSE Whenever one of your characters is chosen for Support, they gain Resist +1 this turn.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 152,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "bb53658c9147113243c4c288f17f357b4f9b6cb3",
  },
  franchise: "Sleeping Beauty",
  fullName: "Prince Phillip - Gallant Defender",
  id: "1f7",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Prince Phillip",
  set: "004",
  strength: 1,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nBEST DEFENSE Whenever one of your characters is chosen for Support, they gain Resist +1 this turn. (Damage dealt to them is reduced by 1.)",
  version: "Gallant Defender",
  willpower: 3,
};
