import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuDaringVisitor: CharacterCard = {
  id: "1y1",
  cardType: "character",
  name: "Sisu",
  version: "Daring Visitor",
  fullName: "Sisu - Daring Visitor",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nBRING ON THE HEAT! When you play this character, banish chosen opposing character with 1 {S} or less.",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 119,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "fc67550a3eb2e05ff941e3dd9ba390ad5570186e",
  },
  abilities: [
    {
      id: "1y1-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1y1-2",
      type: "triggered",
      name: "BRING ON THE HEAT!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "BRING ON THE HEAT! When you play this character, banish chosen opposing character with 1 {S} or less.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};
