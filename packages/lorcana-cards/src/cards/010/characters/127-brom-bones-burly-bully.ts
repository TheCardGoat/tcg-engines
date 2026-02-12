import type { CharacterCard } from "@tcg/lorcana-types";

export const bromBonesBurlyBully: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1ai-1",
      name: "ROUGH AND TUMBLE",
      text: "ROUGH AND TUMBLE Whenever this character challenges a character with 2 {S} or less, each opponent loses 1 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 127,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 4,
  externalIds: {
    ravensburger: "a7a971735b2157f108aa9e53f60ffc6fdda26864",
  },
  franchise: "Sleepy Hollow",
  fullName: "Brom Bones - Burly Bully",
  id: "1ai",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Brom Bones",
  set: "010",
  strength: 5,
  text: "ROUGH AND TUMBLE Whenever this character challenges a character with 2 {S} or less, each opponent loses 1 lore.",
  version: "Burly Bully",
  willpower: 4,
};
