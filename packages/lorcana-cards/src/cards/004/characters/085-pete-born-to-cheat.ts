import type { CharacterCard } from "@tcg/lorcana-types";

export const peteBornToCheat: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "d6v-1",
      name: "I CLOBBER YOU!",
      text: "I CLOBBER YOU! Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 85,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Musketeer"],
  cost: 2,
  externalIds: {
    ravensburger: "2f8a8a1f35e467578c986936eff493b9b875b067",
  },
  fullName: "Pete - Born to Cheat",
  id: "d6v",
  inkType: ["emerald"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Pete",
  set: "004",
  strength: 2,
  text: "I CLOBBER YOU! Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
  version: "Born to Cheat",
  willpower: 3,
};
