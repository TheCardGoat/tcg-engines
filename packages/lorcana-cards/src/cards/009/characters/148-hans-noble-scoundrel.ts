import type { CharacterCard } from "@tcg/lorcana-types";

export const hansNobleScoundrel: CharacterCard = {
  abilities: [
    {
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
      id: "1wq-1",
      name: "ROYAL SCHEMES",
      text: "ROYAL SCHEMES When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 148,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "f7ae3c4a9105e86a37c801caf8ee53341d140429",
  },
  franchise: "Frozen",
  fullName: "Hans - Noble Scoundrel",
  id: "1wq",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Hans",
  set: "009",
  strength: 3,
  text: "ROYAL SCHEMES When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
  version: "Noble Scoundrel",
  willpower: 2,
};
