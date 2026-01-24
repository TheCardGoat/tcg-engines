import type { CharacterCard } from "@tcg/lorcana-types";

export const hansNobleScoundrel: CharacterCard = {
  id: "1wq",
  cardType: "character",
  name: "Hans",
  version: "Noble Scoundrel",
  fullName: "Hans - Noble Scoundrel",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "009",
  text: "ROYAL SCHEMES When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 148,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7ae3c4a9105e86a37c801caf8ee53341d140429",
  },
  abilities: [
    {
      id: "1wq-1",
      type: "triggered",
      name: "ROYAL SCHEMES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "a Princess or Queen character is in play",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "ROYAL SCHEMES When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
};
